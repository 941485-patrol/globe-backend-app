import { Schema, model, Document, Types } from 'mongoose';

export interface UserInterface extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    status: string;
    tasks: Types.Array<Types.ObjectId>;
}

// Schema for a user using mongoose.
const userSchema = new Schema<UserInterface>(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'ACTIVE',
        },
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Task',
            },
        ],
    },
    {
        timestamps: true,
    },
);

export default model<UserInterface>('User', userSchema);
