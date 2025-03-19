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
import { Context, Telegraf } from 'telegraf';
import {
  formatUsername,
  getCtxData,
  getUserName,
  sendTempMessage,
} from 'src/libs/common';
import { sendMessage } from 'src/general';
import { InjectBot } from 'nestjs-telegraf';
import { User } from 'src/users/models/user.model';
import { Op } from 'sequelize';

@Injectable()
export class CoinsService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly starsService: StarsService,
    private readonly transactionRepository: TransactionRepository,
    @InjectBot() private readonly bot: Telegraf<Context>,
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

    this.userRepository.update(
      { lastLogin: new Date() },
      { where: { id: userId } },
    );

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
    return this.starsService.createCoinsTransaction(userId, count);
  }

  async giveCoinsToUser(ctx: Context) {
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

    const coinsCount = args[0];
    const userNameOrId = formatUsername(args[1]);

    if (isNaN(Number(coinsCount))) {
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

    const newCoinsBalance = new BigNumber(user.coinsBalance).plus(coinsCount);

    await this.userRepository.update(
      { coinsBalance: newCoinsBalance.toString() },
      { where: { id: user.id } },
    );

    await sendMessage(
      `✅ <b>Выдано ${coinsCount} Коинов пользователю ${getUserName(user)}</b>`,
      {
        ctx,
        type: 'send',
        isBanner: false,
      },
    );

    await sendMessage(
      `🎉 <b>Поздравляем, вы получили ${coinsCount} Коинов!</b>`,
      {
        type: 'send',
        isBanner: false,
        bot: this.bot,
        chatId: user.telegramId,
      },
    );
  }
}
