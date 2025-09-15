import { Document } from "mongoose";

export class User extends Document {
    username: string;
    password: string;
}