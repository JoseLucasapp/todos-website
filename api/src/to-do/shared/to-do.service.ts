import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './to-do';

@Injectable()
export class ToDoService {
    constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) { }

    async getAll(
        userId,
        filter: any = {},
        sort: any = { createdAt: -1 },
        page: number = 1,
        limit: number = 10,
    ) {
        const skip = (page - 1) * limit;

        const query = { ...filter, userId }

        const todos = await this.todoModel
            .find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await this.todoModel.countDocuments(query);

        return {
            data: todos,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }


    async getById(id: string) {
        return await this.todoModel.findById(id).exec();
    }

    async create(todo: Partial<Todo>) {
        const createTodo = new this.todoModel(todo);
        return await createTodo.save();
    }

    async update(id: string, todo: Todo) {
        await this.todoModel.updateOne({ _id: id }, todo).exec();
    }

    async delete(id: string) {
        await this.todoModel.deleteOne({ _id: id }).exec();
    }
}
