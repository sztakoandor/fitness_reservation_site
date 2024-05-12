import mongoose, { Document, Model, Schema } from 'mongoose';

const SALT_FACTOR = 10;

interface IClass extends Document {
    id: number;
    participants: string[];
    start: Date;
    duration: number; 
    maxPeople: number;
    description: string;
    type: string;
    difficulty: string;
}

const ClassSchema: Schema<IClass> = new mongoose.Schema({
    id: { type: Number, required: true },
    participants: { type: [String], required: true },
    start: { type: Date, required: true },
    duration: { type: Number, required: true },
    maxPeople: { type: Number, required: true },
    description: { type: String, required: false },
    type: { type: String, required: true },
    difficulty: { type: String, required: false }
});

export const Class: Model<IClass> = mongoose.model<IClass>('Class', ClassSchema);
