import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { TransactionRepository } from './repositories/transaction.repository';
import { Transaction } from './models/transaction.model';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CustomCacheModule } from 'src/cache/cache.module';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Transaction]),
    CryptoModule,
    CustomCacheModule,
  ],
  providers: [TransactionRepository, TransactionsService],
  exports: [TransactionRepository],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
