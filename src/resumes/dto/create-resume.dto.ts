import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose, { Date, isValidObjectId } from "mongoose";



export class CreateResumeDto {
    @IsNotEmpty({ message: "Url is not allow null", })
    url: string;

    @IsNotEmpty({ message: "CompanyId is not allow null", })
    @IsMongoId({ message: 'CompanyId is not valid !' })
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "JobId is not allow null", })
    @IsMongoId({ message: 'JobId is not valid !' })
    jobId: mongoose.Schema.Types.ObjectId;

}
