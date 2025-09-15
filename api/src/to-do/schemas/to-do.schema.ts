import * as mongoose from "mongoose";

export const ToDoSchema = new mongoose.Schema({
    description: String,
    completed: Boolean,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })