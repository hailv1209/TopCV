import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose, { Date } from "mongoose";


class Company {

    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}


export class CreateJobDto {

    @IsNotEmpty({ message: "Name is not allow null", })
    name: string;

    @IsNotEmpty({ message: "Skills are not allow null", })
    @IsArray({ message: 'skills must be an array', })
    @IsString({ each: true })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: "Location is not allow null" })
    location: string;

    @IsNotEmpty({ message: "Salary is not allow null" })
    salary: number;

    @IsNotEmpty({ message: "Quantity is not allow null" })
    quantity: number;

    @IsNotEmpty({ message: "Level is not allow null" })
    level: string;

    @IsNotEmpty({ message: "Description is not allow null" })
    description: string;

    @IsNotEmpty({ message: "startDate is not allow null" })
    @IsDateString({ message: 'Wrong format of startDate' })
    startDate: Date;

    @IsNotEmpty({ message: "endDate is not allow null" })
    @IsDateString({ message: 'Wrong format of endDate' })
    endDate: Date;

    isActive: boolean;





}