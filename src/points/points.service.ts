import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AddFarmedPointsDto } from './dto/add-farmed-points.dto';
import { getUserLevelByTaps } from './assets/getUserLevel';
import BigNumber from 'bignumber.js';

@Injectable()
export class PointsService {
  constructor(private readonly userRepository: UserRepository) {}

  async addFarmed(data: AddFarmedPointsDto) {
    const { userId, tapsCount } = data;

    const user = await this.userRepository.findByPk(userId);

    if (!user) return;

    const userCurrentLevel = getUserLevelByTaps(user.totalTapsCount);

    let farmedPointsCount = 0;

    if (user.level > 20) {
      farmedPointsCount = tapsCount * 20;
    } else {
      farmedPointsCount = tapsCount * user.level;
    }

    const newPointsBalance = new BigNumber(user.pointsBalance).plus(
      String(farmedPointsCount),
    );

    user.pointsBalance = newPointsBalance.toString();
    user.level = userCurrentLevel;
    await user.save();

    const newUser = await this.userRepository.findByPk(data.userId);

    return {
      pointsBalance: newUser.pointsBalance,
      userLevel: userCurrentLevel,
      isNewLevel: user.level !== userCurrentLevel,
    };
  }
}

// СДЕЛАТЬ ГЛОБАЛЬНЫЕ ВАЛИДАЦИИ ЗАПРОСОВ И ШИФРОВАНИЕ (из deepseek)
