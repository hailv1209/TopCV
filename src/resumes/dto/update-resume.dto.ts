import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
    @IsNotEmpty({ message: "Status is not allow null", })
    status: string;
}
