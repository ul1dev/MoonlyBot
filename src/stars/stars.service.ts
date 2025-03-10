import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { COINS_FOR_STARS_PRICES } from '../coins/coins.config';
import { UserRepository } from 'src/users/repositories/user.repository';
import {
  TransactionCurrency,
  TransactionStatus,
} from 'src/transactions/models/transaction.model';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { InjectBot } from 'nestjs-telegraf';
import BigNumber from 'bignumber.js';
import {
  Message,
  SuccessfulPayment,
} from 'telegraf/typings/core/types/typegram';

@Injectable()
export class StarsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}

  async createStarsTransaction(userId: string, count: number) {
    const price = COINS_FOR_STARS_PRICES[count];

    if (!price) {
      throw new HttpException(
        {
          error: {
            code: HttpStatus.BAD_REQUEST,
            enMessage: 'Invalid stars count',
            ruMessage: 'Неверное количество звезд',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    this.userRepository.update(
      { lastLogin: new Date() },
      { where: { id: userId } },
    );

    const transaction = await this.transactionRepository.create({
      userId,
      status: TransactionStatus.PROCESSING,
      currency: TransactionCurrency.XTR,
      count,
      amount: price,
      productTitle: 'Coins',
    });

    const invoiceLink = await this.bot.telegram.createInvoiceLink({
      title: `Purchase ${count} coins`,
      description: 'Coins purchase using Telegram Stars',
      payload: transaction.id,
      provider_token: process.env.PAYMENT_PROVIDER_TOKEN,
      currency: 'XTR',
      prices: [{ label: 'Coins', amount: price }],
    });

    return { invoiceLink, transactionId: transaction.id };
  }

  async onSuccessfulPayment(ctx: Context) {
    const message = ctx.message as Message.SuccessfulPaymentMessage;
    const successfulPayment = message?.successful_payment as SuccessfulPayment;
    const transactionId = successfulPayment?.invoice_payload;
    const transaction =
      await this.transactionRepository.findByPk(transactionId);

    if (!transaction) return;

    await this.transactionRepository.update(
      { status: TransactionStatus.PROCESSED },
      { where: { id: transactionId } },
    );

    const user = await this.userRepository.findByPk(transaction.userId);

    const newCoinsBalance = new BigNumber(user.coinsBalance).plus(
      String(transaction.count),
    );

    await this.userRepository.update(
      {
        coinsBalance: newCoinsBalance.toString(),
        lastLogin: new Date(),
      },
      { where: { id: user.id } },
    );
  }
}
