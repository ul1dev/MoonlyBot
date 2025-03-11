import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { InitUserDto } from './dto/init-user.dto';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';

@UseInterceptors(SecureInterceptor)
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
