import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { Transaction } from './models/transaction.model';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [DatabaseModule.forFeature([Transaction])],
  providers: [TransactionRepository, TransactionsService],
  exports: [TransactionRepository],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
