import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {

  constructor(@InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>) { }


  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const result = await this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
    return {
      _id: result._id,
      createdAt: result.createdAt
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let defaultLimit = +pageSize ? +pageSize : 10
    let offset = (+current - 1) * +defaultLimit

    let total = (await this.subscriberModel.find(filter)).length
    let pages = Math.ceil(total / defaultLimit)

    let result = await this.subscriberModel.find(filter)
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
    return await this.subscriberModel.findById(id);
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    return await this.subscriberModel.updateOne({ email: user.email }, {
      ...updateSubscriberDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    }, { upsert: true });
  }

  async remove(id: string, user: IUser) {
    await this.subscriberModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.subscriberModel.softDelete({ _id: id });
  }
  async getSkills(user: IUser) {
    const { email } = user;
    return await this.subscriberModel.findOne({ email }, { skills: 1 });
  }
}
