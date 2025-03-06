import { Module } from '@nestjs/common';
import { BoostsController } from './boosts.controller';
import { BoostsService } from './boosts.service';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [UsersModule, TransactionsModule],
  controllers: [BoostsController],
  providers: [BoostsService],
})
export class BoostsModule {}
