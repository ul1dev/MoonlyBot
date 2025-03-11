import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';

@UseInterceptors(SecureInterceptor)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':transactionId')
  async addFarmed(@Param('transactionId') id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}
