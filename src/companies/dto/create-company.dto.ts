import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty({message : "Name is not allowed null"})
    name : string;

    @IsNotEmpty({message : "Address is not allowed null"})
    address : string;

    @IsNotEmpty({message : "Description is not allowed null"})
    description : string;

}
