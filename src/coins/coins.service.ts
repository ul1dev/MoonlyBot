import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { COINS_FOR_POINTS_PRICES } from './coins.config';
import { StarsService } from '../stars/stars.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import BigNumber from 'bignumber.js';

@Injectable()
export class CoinsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly starsService: StarsService,
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
            code: HttpStatus.FORBIDDEN,
            enMessage: 'Not enough points',
            ruMessage: 'Недостаточно поинтов',
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const newPointsBalance = new BigNumber(user.pointsBalance).minus(
      String(price),
    );

    await this.userRepository.update(
      {
        pointsBalance: newPointsBalance.toString(),
        coinsBalance: user.coinsBalance + count,
      },
      {
        where: { id: user.id },
      },
    );

    return {
      pointsBalance: newPointsBalance.toString(),
      coinsBalance: user.coinsBalance + count,
    };
  }

  async buyWithStars(userId: string, count: number) {
    return this.starsService.createStarsTransaction(userId, count);
  }
}
