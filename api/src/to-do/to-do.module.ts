import { Module } from '@nestjs/common';
import { ToDoService } from './shared/to-do.service';
import { ToDoController } from './to-do.controller';
import { ToDoSchema } from './schemas/to-do.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Todo", schema: ToDoSchema }]),
  ],
  controllers: [ToDoController],
  providers: [ToDoService],
})
export class ToDoModule { }
