import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BOOSTS_PRICES } from './boosts.config';
import { UserRepository } from 'src/users/repositories/user.repository';

@Injectable()
export class BoostsService {
  constructor(private readonly userRepository: UserRepository) {}

  async buyBoosts(userId: string, count: number) {
    const price = BOOSTS_PRICES[count];
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
    if (user.coinsBalance < price) {
      throw new HttpException(
        {
          error: {
            code: HttpStatus.FORBIDDEN,
            enMessage: 'Not enough coins',
            ruMessage: 'Недостаточно коинов',
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.userRepository.update(
      {
        coinsBalance: user.coinsBalance - price,
        boostsBalance: user.boostsBalance + count,
      },
      {
        where: { id: user.id },
      },
    );

    return {
      boostsBalance: user.boostsBalance + count,
      coinsBalance: user.coinsBalance - price,
    };
  }
}
