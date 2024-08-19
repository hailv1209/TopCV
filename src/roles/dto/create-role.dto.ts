import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: "Name is not allowed null" })
    name: string;

    @IsNotEmpty({ message: "Logo is not allowed null" })
    description: string;

    @IsBoolean({ message: 'IsActive must be boolean' })
    isActive: boolean;

    @IsNotEmpty({ message: "Permission is not allowed null" })
    @IsArray({ message: 'Permission must be an array', })
    @IsMongoId({ each: true })
    permissions: mongoose.Schema.Types.ObjectId[];
}
