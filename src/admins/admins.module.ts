import { Module } from '@nestjs/common';
import { AdminsUpdate } from './admins.update';
import { AdminsService } from './admins.service';
import { UsersModule } from 'src/users/users.module';
import { GeneralModule } from 'src/general/general.module';

@Module({
  imports: [UsersModule, GeneralModule],
  providers: [AdminsUpdate, AdminsService],
})
export class AdminsModule {}
