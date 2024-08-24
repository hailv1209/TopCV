import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUser } from 'src/users/user.interface';
import { Job, JobDocument } from './schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class JobsService {

  constructor(
    @InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>
  ) { }

  checkDays(startDate: Date, endDate: Date) {
    return dayjs(startDate).isBefore(endDate)
  }
  async create(createJobDto: CreateJobDto, user: IUser) {
    // @ts-ignore: Unreachable code error
    if (!this.checkDays(createJobDto.startDate, createJobDto.endDate)) {
      throw new BadRequestException('Start date must before end date')
    }
    let data = await this.jobModel.create({
      ...createJobDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: data._id,
      createdAt: data.createdAt
    }
  }

  async findAll(current: number, pageSize: number, qs: string, req: Request) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+current - 1) * (+pageSize);
    let defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    // const user = req.user as IUser
    // if (user.role.name === "HR") {
    //   const companyInfo = (await this.userModel.findOne({ _id: user._id }).select({ "company": 1, "_id": 0 })).toObject();
    //   filter["companyId"] = companyInfo.company._id;
    //   let result = await this.jobModel.find(filter)
    //     .skip(offset)
    //     .limit(defaultLimit)
    //     //@ts-ignore
    //     .sort(sort)
    //     .select(projection)
    //     .populate(population)
    //     .exec();

    //   return {
    //     'meta': {
    //       'current': current,
    //       'pageSize': pageSize,
    //       'pages': totalPages,
    //       'total': totalItems
    //     },
    //     result

    //   };
    // }


    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .exec();

    return {
      meta: {
        current: current, //trang hiện tại
        pageSize: pageSize, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }

  }

  async findOne(id: string) {
    return await this.jobModel.findById(id);
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    // @ts-ignore: Unreachable code error
    if (!this.checkDays(updateJobDto.startDate, updateJobDto.endDate)) {
      throw new BadRequestException('Start date must before end date')
    }
    return await this.jobModel.updateOne({ _id: id }, {
      ...updateJobDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    await this.jobModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.jobModel.softDelete({ _id: id });
  }
}
