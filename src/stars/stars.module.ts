import { Module } from '@nestjs/common';
import { StarsService } from './stars.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TransactionsModule, UsersModule],
  providers: [StarsService],
  exports: [StarsService],
})
export class StarsModule {}
