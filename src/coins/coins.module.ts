import { Module } from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { UsersModule } from 'src/users/users.module';
import { StarsModule } from 'src/stars/stars.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CoinsUpdate } from './coins.update';
import { GeneralModule } from 'src/general/general.module';

@Module({
  imports: [UsersModule, StarsModule, TransactionsModule, GeneralModule],
  controllers: [CoinsController],
  providers: [CoinsService, CoinsUpdate],
})
export class CoinsModule {}
