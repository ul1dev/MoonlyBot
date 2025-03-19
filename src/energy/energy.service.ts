import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Op } from 'sequelize';
import { sendMessage } from 'src/general';
import {
  formatUsername,
  getCtxData,
  getUserName,
  sendTempMessage,
} from 'src/libs/common';
import { StarsService } from 'src/stars/stars.service';
import { User } from 'src/users/models/user.model';
import { UserRepository } from 'src/users/repositories/user.repository';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class EnergyService {
  constructor(
    private readonly starsService: StarsService,
    private readonly userRepository: UserRepository,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async buyWithStars(userId: string, count: number) {
    return this.starsService.createEnergyTransaction(userId, count);
  }

  async giveEnergyToUser(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);

    if (ctxUser.id != process.env.CODER_TG_ID) return;

    // @ts-ignore
    const args = ctx?.payload?.split(' ');

    if (!args?.length || args?.length < 2) {
      return sendTempMessage({
        text: `🚫 <b>Неверно переданы аргументы</b>`,
        ctx,
        bot: this.bot,
        isDeleteInitMess: true,
        time: 5000,
      });
    }

    const energyCount = Number(args[0]);
    const userNameOrId = formatUsername(args[1]);

    if (isNaN(energyCount)) {
      return sendTempMessage({
        text: `🚫 <b>Неверное число</b>`,
        ctx,
        bot: this.bot,
        isDeleteInitMess: true,
        time: 5000,
      });
    }

    let user: User;

    if (userNameOrId === 'me') {
      user = await this.userRepository.findByTgId(process.env.CODER_TG_ID);
    } else {
      user = await this.userRepository.findOne({
        where: {
          [Op.or]: [{ telegramId: userNameOrId }, { userName: userNameOrId }],
        },
      });
    }

    if (!user) {
      return sendTempMessage({
        text: `🚫 <b>Пользователь не найден</b>`,
        ctx,
        bot: this.bot,
        isDeleteInitMess: true,
        time: 5000,
      });
    }

    const newEnergyBalance = user.maxEnergy + energyCount;

    await this.userRepository.update(
      { maxEnergy: newEnergyBalance },
      { where: { id: user.id } },
    );

    await sendMessage(
      `✅ <b>Энергия пользователя ${getUserName(user)} увеличена на ${energyCount}</b>`,
      {
        ctx,
        type: 'send',
        isBanner: false,
      },
    );

    await sendMessage(
      `🎉 <b>Поздравляем, ваша максимальная энергия увеличена на ${energyCount}!</b>`,
      {
        type: 'send',
        isBanner: false,
        bot: this.bot,
        chatId: user.telegramId,
      },
    );
  }
}
