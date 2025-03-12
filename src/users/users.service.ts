import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { getCtxData } from 'src/libs/common';
import { UserRepository } from './repositories/user.repository';
import { UserRolesRepository } from 'src/roles/repositories/user-roles.repository';
import { InitUserDto } from './dto/init-user.dto';
import { ReferralRepository } from 'src/referrals/repositories/referrals.repository';
import BigNumber from 'bignumber.js';
import { InjectBot } from 'nestjs-telegraf';
import { newRefarralMarkup, newRefarralMessage } from 'src/referrals/responses';
import { sendMessage } from 'src/general';
import { getAfkPointsCount } from 'src/points/assets/getAfkPointsCount';
import { getCurrentEnergy } from 'src/points/assets/getCurrentEnergy';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRolesRepository: UserRolesRepository,
    private readonly referralRepository: ReferralRepository,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async updateUserNamesByCtx(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    const telegramId = ctxUser.id;
    const firstName = ctxUser.first_name;
    const lastName = ctxUser.last_name;
    const userName = ctxUser.username;

    try {
      await this.userRepository.update(
        { firstName, lastName, userName },
        { where: { telegramId: String(telegramId) } },
      );
    } catch (error) {}

    if (telegramId == process.env.CODER_TG_ID) {
      const user = await this.userRepository.findByTgId(telegramId);

      if (user) {
        await this.userRolesRepository.findOrCreate({
          where: {
            userId: user.id,
            roleName: 'SUPER_ADMIN',
          },
          defaults: {
            userId: user.id,
            roleName: 'SUPER_ADMIN',
          },
        });
      }
    }
  }

  async findOrCreateUserByCtx(ctx: Context | any) {
    const { ctxUser } = getCtxData(ctx);
    const { id, first_name, last_name, username } = ctxUser;

    const isCreated = await this.userRepository.findByTgId(id);
    if (isCreated) return isCreated;

    const user = await this.userRepository.create({
      telegramId: id,
      firstName: first_name?.trim(),
      lastName: last_name?.trim(),
      userName: username?.trim(),
    });

    return user;
  }

  async initUser(userData: InitUserDto) {
    let user = await this.userRepository.findOne({
      where: { telegramId: userData.telegramId },
    });

    if (!user) {
      user = await this.userRepository.create(userData);

      if (userData.referralId) {
        const referral = await this.userRepository.findByPk(
          userData.referralId,
        );

        if (referral) {
          user.coinsBalance = '30';
          await user.save();

          const newReferralCoinsBalance = new BigNumber(
            referral.coinsBalance,
          ).plus('100');

          this.userRepository.update(
            {
              invitedUsersCount: referral.invitedUsersCount + 1,
              coinsBalance: newReferralCoinsBalance.toString(),
            },
            { where: { id: userData.referralId } },
          );

          this.referralRepository.create({
            inviterUserId: userData.referralId,
            invitedUserId: user.id,
          });

          try {
            sendMessage(newRefarralMessage(user.userName), {
              bot: this.bot,
              isBanner: false,
              type: 'send',
              chatId: referral.telegramId,
              reply_markup: newRefarralMarkup(),
            });
          } catch (error) {}
        }
      }

      return { user, afkPointsCount: 0 };
    }

    this.userRepository.update(
      { lastLogin: new Date() },
      { where: { id: user.id } },
    );

    try {
      user.firstName = userData?.firstName;
      user.lastName = userData?.lastName;
      user.userName = userData?.userName;

      if (userData.ip) {
        user.ip = userData.ip;
      }
      if (userData.userAgent) {
        user.userAgent = userData.userAgent;
      }
    } catch (error) {}

    let afkPointsCount = 0;

    if (user?.lastLogin) {
      afkPointsCount = getAfkPointsCount(user?.lastLogin, user?.boostsBalance);

      if (afkPointsCount > 0) {
        user.pointsBalance = new BigNumber(user.pointsBalance)
          .plus(String(afkPointsCount))
          .toString();
      }
    }

    const updatedEnergy = getCurrentEnergy(user.lastEnergyUpdate, user.energy);

    user.energy = updatedEnergy;
    user.lastEnergyUpdate = new Date();

    // глобально на всю функцию
    await user.save();

    return { user, afkPointsCount };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findByPk(id);

    return user;
  }
}
