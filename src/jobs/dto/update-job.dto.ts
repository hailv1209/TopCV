import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateJobDto extends PartialType(CreateJobDto) { }
