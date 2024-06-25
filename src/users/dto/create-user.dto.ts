import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @Length(10, 20, {
        message : "The minimum of password is 10 character and maximum is 20"
    })
    password : string;
    
    @IsNotEmpty()
    name : string;

    address : string;
}
