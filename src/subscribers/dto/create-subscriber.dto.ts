import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: "Name is not allow null", })
    name: string;

    @IsEmail({}, { message: 'Email is wrong format' })
    @IsNotEmpty({ message: "Email is not allow null", })
    email: string;

    @IsNotEmpty({ message: "Skills are not allow null", })
    @IsArray({ message: 'skills must be an array', })
    @IsString({ each: true })
    skills: string[];
}
