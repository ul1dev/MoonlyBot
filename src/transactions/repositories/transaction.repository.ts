import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Transaction,
  TransactionCreationArgs,
} from '../models/transaction.model';

@Injectable()
export class TransactionRepository extends AbstractRepository<
  Transaction,
  TransactionCreationArgs
> {
  protected readonly logger = new Logger(Transaction.name);

  constructor(
    @InjectModel(Transaction)
    private TransactionModel: typeof Transaction,
  ) {
    super(TransactionModel);
  }
}
