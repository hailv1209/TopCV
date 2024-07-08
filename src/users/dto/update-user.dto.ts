import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import mongoose from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    @IsNotEmpty({ message: '_id is not allow null' })
    _id: mongoose.Schema.Types.ObjectId;
}
