import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':transactionId')
  async addFarmed(@Param('transactionId') id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}
