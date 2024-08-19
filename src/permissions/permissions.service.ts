import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { use } from 'passport';


@Injectable()
export class PermissionsService {

  constructor(
    @InjectModel(Permission.name) private PermissionModel: SoftDeleteModel<PermissionDocument>
  ) { }


  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto
    const exist = await this.PermissionModel.findOne({ apiPath, method })
    if (exist) throw new BadRequestException(`Permission with apiPath = ${apiPath} and method = ${method} existed`)

    const result = await this.PermissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

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

    let total = (await this.PermissionModel.find(filter)).length
    let pages = Math.ceil(total / defaultLimit)

    let result = await this.PermissionModel.find(filter)
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
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException(`The Id = ${id} is not valid`)
    return await this.PermissionModel.findById(id)
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException(`The Id = ${id} is not valid`)
    return await this.PermissionModel.updateOne({ _id: id }, {
      ...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }


  async remove(id: string, user: IUser) {
    await this.PermissionModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.PermissionModel.softDelete({ _id: id })
  }
}
