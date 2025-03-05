import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './repositories/transaction.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getTransactionById(id: string) {
    const transaction = await this.transactionRepository.findByPk(id);

    return transaction;
  }
}
