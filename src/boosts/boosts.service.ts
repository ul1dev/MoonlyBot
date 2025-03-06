import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BOOSTS_PRICES } from './boosts.config';
import { UserRepository } from 'src/users/repositories/user.repository';
import BigNumber from 'bignumber.js';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import {
  TransactionCurrency,
  TransactionStatus,
} from 'src/transactions/models/transaction.model';

@Injectable()
export class BoostsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async buyBoosts(userId: string, count: number) {
    const price: number = BOOSTS_PRICES[count];
    if (!price) {
      throw new HttpException(
        {
          error: {
            code: HttpStatus.BAD_REQUEST,
            enMessage: 'Invalid boosts count',
            ruMessage: 'Неверное количество бустов',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findByPk(userId);
    if (new BigNumber(user.coinsBalance).lt(new BigNumber(String(price)))) {
      throw new HttpException(
        {
          error: {
            code: HttpStatus.BAD_REQUEST,
            enMessage: 'Not enough coins',
            ruMessage: 'Недостаточно коинов',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCoinsBalance = new BigNumber(user.coinsBalance).minus(
      String(price),
    );
    const newBoostsBalance = user.boostsBalance + count;

    await this.userRepository.update(
      {
        coinsBalance: newCoinsBalance.toString(),
        boostsBalance: newBoostsBalance,
      },
      {
        where: { id: user.id },
      },
    );

    const transaction = await this.transactionRepository.create({
      userId: user.id,
      status: TransactionStatus.PROCESSED,
      currency: TransactionCurrency.COINS,
      count,
      amount: price,
      productTitle: 'Boosts',
    });

    return {
      boostsBalance: newBoostsBalance,
      coinsBalance: newCoinsBalance.toString(),
      transactionId: transaction.id,
    };
  }
}
