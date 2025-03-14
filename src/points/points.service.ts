import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AddFarmedPointsDto } from './dto/add-farmed-points.dto';
import { getUserLevelByTaps } from './assets/getUserLevel';
import BigNumber from 'bignumber.js';
import { getCurrentEnergy } from './assets/getCurrentEnergy';

@Injectable()
export class PointsService {
  constructor(private readonly userRepository: UserRepository) {}

  async addFarmed(data: AddFarmedPointsDto) {
    const { userId, tapsCount: dirtyTapsCount } = data;

    const user = await this.userRepository.findByPk(userId);

    if (!user) return;

    let tapsCount = dirtyTapsCount;

    const updatedEnergy = getCurrentEnergy(
      user.lastEnergyUpdate,
      user.energy,
      user.maxEnergy,
    );

    if (tapsCount > updatedEnergy) {
      tapsCount = updatedEnergy;
    }

    const newTapsCount = new BigNumber(user.totalTapsCount).plus(
      String(tapsCount),
    );

    const userCurrentLevel = getUserLevelByTaps(newTapsCount);

    const isNewLevel = user.level !== userCurrentLevel;

    const farmedPointsCount = tapsCount * user.level;

    const newPointsBalance = new BigNumber(user.pointsBalance).plus(
      String(farmedPointsCount),
    );

    user.energy = updatedEnergy - tapsCount;
    user.lastEnergyUpdate = new Date();
    user.pointsBalance = newPointsBalance.toString();
    user.totalTapsCount = newTapsCount.toString();
    user.level = userCurrentLevel;
    user.lastLogin = new Date();
    await user.save();

    return {
      pointsBalance: user.pointsBalance,
      userEnergy: user.energy,
      userLevel: user.level,
      isNewLevel,
    };
  }
}
