import { Module } from '@nestjs/common';
import { BoostsController } from './boosts.controller';
import { BoostsService } from './boosts.service';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CustomCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [UsersModule, TransactionsModule, CryptoModule, CustomCacheModule],
  controllers: [BoostsController],
  providers: [BoostsService],
})
export class BoostsModule {}
