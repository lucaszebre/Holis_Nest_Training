import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto } from 'src/auth/createUser.dto';
import { UserEntity } from './users.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('users/')
  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userService.getUsers({});

    if (!users.length) {
      throw new HttpException('No user in the database', HttpStatus.FORBIDDEN);
    }

    return users.map((user) => {
      return new UserEntity({
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name || '',
      });
    });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('users/:id')
  async getUser(@Param('id') id: number): Promise<UserEntity | null> {
    const user = await this.userService.getUser({
      id: Number(id),
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.FORBIDDEN);
    }

    return new UserEntity({
      id: user.id,
      name: user.name || '',
      password: user.password,
      email: user.email,
    });
  }

  @Post('users')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserModel | undefined> {
    const { email, name, password } = createUserDto;

    const listUser = await this.userService.getUsers({});

    const emailUSers = listUser.map((user) => {
      return user.email;
    });

    if (emailUSers.includes(email)) {
      throw new HttpException(
        'User already register',

        HttpStatus.FORBIDDEN,
      );
    }

    if (email)
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
  ): Promise<UserEntity> {
    const { email, name } = putData;
    const user = await this.userService.updateUser({
      where: { id: Number(id) },
      data: { email, name },
    });

    if (!user) {
      throw new HttpException(
        'Could not update the user',

        HttpStatus.NOT_FOUND,
      );
    }

    return new UserEntity({
      id: user.id,
      email: user.email,
      name: user.name || '',
      password: user.password,
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: number): Promise<UserEntity> {
    const user = await this.userService.deleteUser({ id: Number(id) });

    return new UserEntity({
      id: user.id,
      email: user.email,
      name: user.name || '',
      password: user.password,
    });
  }
}
