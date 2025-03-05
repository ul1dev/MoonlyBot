import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/libs/common';
import { User } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { RolesModule } from 'src/roles/roles.module';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule.forFeature([User]), RolesModule],
  providers: [UsersService, UserRepository],
  exports: [UserRepository, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
