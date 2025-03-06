import { Module } from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { UsersModule } from 'src/users/users.module';
import { StarsModule } from 'src/stars/stars.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [UsersModule, StarsModule, TransactionsModule],
  controllers: [CoinsController],
  providers: [CoinsService],
})
export class CoinsModule {}
