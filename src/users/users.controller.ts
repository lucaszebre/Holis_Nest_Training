import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('users/')
  async getUsers(): Promise<UserModel[]> {
    return this.userService.getUsers({});
  }

  @Get('users/:id')
  async getUser(@Param('id') id: number): Promise<UserModel | null> {
    return this.userService.getUser({
      id,
    });
  }

  @Post('users')
  async createUser(
    @Body() postData: { email: string; name?: string; password: string },
  ): Promise<UserModel> {
    const { email, name, password } = postData;
    return this.userService.createUser({
      email,
      name,
      password,
    });
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() putData: { email?: string; name?: string },
  ): Promise<UserModel> {
    const { email, name } = putData;
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: { email, name },
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<UserModel> {
    return this.userService.deleteUser({ id });
  }
}
