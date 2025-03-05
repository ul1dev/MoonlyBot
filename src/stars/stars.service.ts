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
      prices: [{ label: 'Coins', amount: price * 100 }],
    });

    return { invoiceLink, transactionId: transaction.id };
  }

  async onSuccessfulPayment(ctx: Context) {
    // @ts-ignore
    const transactionId = ctx?.message?.successful_payment?.invoice_payload;
    const transaction =
      await this.transactionRepository.findByPk(transactionId);

    if (transaction) {
      await this.transactionRepository.update(transactionId, {
        status: TransactionStatus.PROCESSED,
      });

      const user = await this.userRepository.findByPk(transaction.userId);
      await this.userRepository.update(
        {
          coinsBalance: user.coinsBalance + transaction.count,
        },
        {
          where: { id: user.id },
        },
      );
    }
  }
}
