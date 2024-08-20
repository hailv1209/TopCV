import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';


export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
    permissions: Permission[];

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: Date })
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop({ type: Date })
    deletedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);