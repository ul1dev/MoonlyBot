import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { InitUserDto } from './dto/init-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('init')
  async initUser(@Body() body: InitUserDto) {
    return this.usersService.initUser(body);
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.usersService.getUserById(userId);
  }
}
