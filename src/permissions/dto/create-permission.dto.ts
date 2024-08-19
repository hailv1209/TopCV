import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: "Name is not allowed null" })
    name: string;

    @IsNotEmpty({ message: "ApiPath is not allowed null" })
    apiPath: string;

    @IsNotEmpty({ message: "Method is not allowed null" })
    method: string;

    @IsNotEmpty({ message: "Module is not allowed null" })
    module: string;
}
