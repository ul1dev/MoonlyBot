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

    if (user) {
      this.userRepository.update(
        { lastLogin: new Date() },
        { where: { id: user.id } },
      );
    } else {
      user = await this.userRepository.create(userData);

      if (userData.referralId) {
        const referral = await this.userRepository.findByPk(
          userData.referralId,
        );

        if (referral) {
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
    }

    try {
      this.userRepository.update(
        {
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          userName: userData?.userName,
        },
        { where: { telegramId: String(userData.telegramId) } },
      );
    } catch (error) {}

    // ВЫСЧИТЫВАТЬ СКОЛЬКО ТИП ЗАРАБОТАЛ ПОИНТОВ АФК И ВОЗВРАЩАТЬ ЭТО ЧИСЛО И СРАЗУ ПЛЮСОВАТЬ К БАЛАНСУ

    return { user };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findByPk(id);

    return user;
  }
}
