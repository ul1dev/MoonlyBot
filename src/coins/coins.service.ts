import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { COINS_FOR_POINTS_PRICES } from './coins.config';
import { StarsService } from '../stars/stars.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import BigNumber from 'bignumber.js';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import {
  TransactionCurrency,
  TransactionStatus,
} from 'src/transactions/models/transaction.model';

@Injectable()
export class CoinsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly starsService: StarsService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async buyWithPoints(userId: string, count: number) {
    const price = COINS_FOR_POINTS_PRICES[count];
    if (!price) {
      throw new HttpException(
        {
          error: {
            code: HttpStatus.BAD_REQUEST,
            enMessage: 'Invalid coins count',
            ruMessage: 'Неверное количество коинов',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findByPk(userId);
    if (user.pointsBalance < price) {
      throw new HttpException(
        {
          error: {
            code: HttpStatus.BAD_REQUEST,
            enMessage: 'Not enough points',
            ruMessage: 'Недостаточно поинтов',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPointsBalance = new BigNumber(user.pointsBalance).minus(
      String(price),
    );
    const newCoinsBalance = new BigNumber(user.coinsBalance).plus(
      String(count),
    );

    await this.userRepository.update(
      {
        pointsBalance: newPointsBalance.toString(),
        coinsBalance: newCoinsBalance.toString(),
      },
      {
        where: { id: user.id },
      },
    );

    const transaction = await this.transactionRepository.create({
      userId: user.id,
      status: TransactionStatus.PROCESSED,
      currency: TransactionCurrency.POINTS,
      count,
      amount: price,
      productTitle: 'Coins',
    });

    return {
      pointsBalance: newPointsBalance.toString(),
      coinsBalance: newCoinsBalance.toString(),
      transactionId: transaction.id,
    };
  }

  async buyWithStars(userId: string, count: number) {
    return this.starsService.createStarsTransaction(userId, count);
  }
}
