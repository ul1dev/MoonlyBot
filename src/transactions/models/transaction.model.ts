import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';

export enum TransactionStatus {
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
}

export enum TransactionCurrency {
  XTR = 'XTR',
  COINS = 'COINS',
  POINTS = 'POINTS',
}

@Table({ tableName: 'Transactions' })
export class Transaction extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    defaultValue: TransactionStatus.PROCESSING,
  })
  status: TransactionStatus;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionCurrency)),
    allowNull: false,
  })
  currency: TransactionCurrency;

  @Column(DataType.INTEGER)
  count: number;

  @Column(DataType.INTEGER)
  amount: number;

  @Column(DataType.STRING(255))
  productTitle: string;
}
