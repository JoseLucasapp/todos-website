import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user';
import * as dotenv from "dotenv";
import * as bcrypt from 'bcryptjs';

dotenv.config();

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    async getById(id: string) {
        return await this.userModel.findById(id).exec();
    }

    async getByUsername(username: string) {
        return await this.userModel.findOne({ username: username }).select('+password').exec();
    }

    async create(user: User) {
        const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);

        const userAlreadyExists = await this.getByUsername(user.username);

        if (userAlreadyExists) throw new BadRequestException("Username already exists");

        const password = await bcrypt.hash(user.password, saltRounds);

        const createUser = new this.userModel({ username: user.username, password: password });
        return await createUser.save();
    }

    async delete(id: string) {
        return await this.userModel.deleteOne({ _id: id }).exec();
    }
}
