import { Schema, model, Document, Types } from 'mongoose';

export interface TaskInterface extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    user: Types.ObjectId;
    _doc?: unknown;
}

// Schema for a task using mongoose.
const taskSchema = new Schema<TaskInterface>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default model<TaskInterface>('Task', taskSchema);
