import { Module } from '@nestjs/common';
import { StarsService } from './stars.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UsersModule } from 'src/users/users.module';
import { StarsUpdate } from './stars.update';

@Module({
  imports: [TransactionsModule, UsersModule],
  providers: [StarsService, StarsUpdate],
  exports: [StarsService],
})
export class StarsModule {}
