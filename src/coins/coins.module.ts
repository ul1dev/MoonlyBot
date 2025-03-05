import { Module } from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { UsersModule } from 'src/users/users.module';
import { StarsModule } from 'src/stars/stars.module';

@Module({
  imports: [UsersModule, StarsModule],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}
