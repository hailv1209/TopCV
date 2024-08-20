import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';
import path from 'path';
@Injectable()
export class UsersService {


  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>


  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }
  isExit = async (email: string) => {
    return await this.userModel.findOne({ email })
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, age, gender, address, role, company } = createUserDto
    if (this.isExit(email)) {
      throw new BadRequestException(`The ${email} has exited, please use another email`)
    }
    const hashPassword = this.getHashPassword(password)
    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword,
      age,
      gender,
      address,
      role,
      company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }

  async registerUser(registerDTO: RegisterUserDto) {
    const { name, email, password, age, gender, address } = registerDTO
    if (this.isExit(email)) {
      throw new BadRequestException(`The ${email} has exited, please use another email`)
    }

    //fetch user role 
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });

    const hashPassword = this.getHashPassword(password)
    let user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: userRole?._id
    })
    return {
      _id: user?._id,
      createdAt: user?.createdAt
    }

  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .select("-password")
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid((id)))
      return 'Not found user'
    let user = await this.userModel.findOne({
      _id: id
    })
      .select("-password")
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
    return user;
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username
    }).populate({ path: 'role', select: { name: 1 } });
  }


  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: id }, {
      ...updateUserDto,
      updatedBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid((id)))
      return 'Unavaible Id user'
    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === "abcdef@gmail.com") {
      throw new BadRequestException("Can not remove admin account")
    }
    await this.userModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.userModel.softDelete({ _id: id });
  }

  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne({ _id }, { refreshToken }
    );
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
      .populate({ path: 'role', select: { name: 1 } });
  }
}
