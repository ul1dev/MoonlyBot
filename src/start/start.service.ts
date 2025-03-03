import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { StartArgsService } from './args.service';
import { sendMessage } from 'src/general';
import { startMarkup, startMessage } from './responses';

@Injectable()
export class StartService {
  constructor(private readonly argsService: StartArgsService) {}

  async sendStart(ctx: Context | any) {
    const args = ctx.args;

    if (args.length) {
      return await this.argsService.argsHandler(ctx);
    }

    await this.sendStartMessage(ctx);
  }

  async sendStartMessage(ctx: Context) {
    await sendMessage(startMessage(), {
      ctx,
      reply_markup: startMarkup(),
      type: 'send',
    });
  }
}
