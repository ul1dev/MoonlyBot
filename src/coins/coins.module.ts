import { Module } from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { UsersModule } from 'src/users/users.module';
import { StarsModule } from 'src/stars/stars.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CoinsUpdate } from './coins.update';
import { GeneralModule } from 'src/general/general.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CustomCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    UsersModule,
    StarsModule,
    TransactionsModule,
    GeneralModule,
    CryptoModule,
    CustomCacheModule,
  ],
  controllers: [CoinsController],
  providers: [CoinsService, CoinsUpdate],
})
export class CoinsModule {}
