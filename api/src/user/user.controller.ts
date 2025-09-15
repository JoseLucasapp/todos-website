import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserService } from './shared/user.service';
import { User } from './shared/user';
import { Public } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':id')
  async getById(
    @Param('id') id: string
  ): Promise<User> {
    const user = await this.userService.getById(id);

    if (!user) throw new NotFoundException(`User with id ${id} was not found`);

    return user;
  }

  @Public()
  @Post()
  async create(
    @Body() user: User
  ): Promise<User> {
    return await this.userService.create(user)
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ): Promise<User> {
    return await this.delete(id);
  }
}
