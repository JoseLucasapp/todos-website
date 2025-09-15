import { Document } from "mongoose";

export class Todo extends Document {
    description: string;
    completed: boolean;
    userId: string;
}