import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {

  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }


  async create(createResumeDto: CreateResumeDto, user: IUser) {
    let data = await this.resumeModel.create({
      email: user.email,
      userId: user._id,
      url: createResumeDto.url,
      status: "PENDING",
      companyId: createResumeDto.companyId,
      jobId: createResumeDto.jobId,
      history: [
        {
          status: "PENDING",
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ],
      createdBy: {
        _id: user._id,
        email: user.email
      }

    });
    return {
      "_id": data._id,
      "createdAt": data.createdAt
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let defaultLimit = +pageSize ? +pageSize : 10
    let offset = (+current - 1) * +defaultLimit

    let total = (await this.resumeModel.find(filter)).length
    let pages = Math.ceil(total / defaultLimit)

    let result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      //@ts-ignore
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();


    return {
      'meta': {
        'current': current,
        'pageSize': pageSize,
        'pages': pages,
        'total': total
      },
      result

    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`This is not a avaiable ID ${id}`)
    }
    return await this.resumeModel.findById(id);
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUser) {
    return await this.resumeModel.updateOne({ _id: id }, {
      status: updateResumeDto.status,
      $push: {
        history: {
          status: updateResumeDto.status,
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      },
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    await this.resumeModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.resumeModel.softDelete({ _id: id });
  }

  async getCV(user: IUser) {
    return await this.resumeModel.find({
      userId: user._id
    })
  }
}
