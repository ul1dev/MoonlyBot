import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../models/transaction.model';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
  ) {}

  async create(data: Partial<Transaction>) {
    return this.transactionModel.create(data);
  }

  async findByPk(id: string) {
    return this.transactionModel.findByPk(id);
  }

  async update(id: string, data: Partial<Transaction>) {
    const [affectedCount] = await this.transactionModel.update(data, {
      where: { id },
    });
    return affectedCount > 0;
  }
}
