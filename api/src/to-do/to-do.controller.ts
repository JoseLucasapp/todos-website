import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ToDoService } from './shared/to-do.service';
import { Todo } from './shared/to-do';

@Controller('notes')
export class ToDoController {
  constructor(private readonly toDoService: ToDoService) { }

  @Get()
  async getAll(
    @Req() req,
    @Query('completed') completed?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('order') order: string = 'desc',
  ) {
    const filter: any = {};

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    const sort: any = { [sortBy]: order === 'desc' ? -1 : 1 };

    return this.toDoService.getAll(
      req.user.userId,
      filter,
      sort,
      Number(page),
      Number(limit),
    );
  }

  @Post()
  async create(
    @Req() req,
    @Body() todo: Todo
  ): Promise<Todo> {
    return await this.toDoService.create({
      ...todo,
      userId: req.user.userId,
    })
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() todo: Todo
  ): Promise<void> {
    await this.toDoService.update(id, todo);

  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ): Promise<void> {
    await this.toDoService.delete(id);
  }
}
