import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, Length, ValidateNested } from "class-validator";
import mongoose from "mongoose";


class Company {

    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}


export class CreateUserDto {

    @IsNotEmpty({ message: "Name is not allow null" })
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(10, 20, {
        message: "The minimum of password is 10 character and maximum is 20"
    })
    password: string;

    @IsNotEmpty({ message: "Age is not allow null" })
    age: number;

    @IsNotEmpty({ message: "Gender is not allow null" })
    gender: string;

    @IsNotEmpty({ message: "Address is not allow null" })
    address: string;

    @IsNotEmpty({ message: "Role is not allow null" })
    role: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;


}



export class RegisterUserDto {

    @IsNotEmpty({ message: "Name is not allow null" })
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(10, 20, {
        message: "The minimum of password is 10 character and maximum is 20"
    })
    password: string;

    @IsNotEmpty({ message: "Age is not allow null" })
    age: number;

    @IsNotEmpty({ message: "Gender is not allow null" })
    gender: string;

    @IsNotEmpty({ message: "Address is not allow null" })
    address: string;



}
