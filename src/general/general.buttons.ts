import { Context } from 'telegraf';
import { Action, Update } from 'nestjs-telegraf';
import { GeneralPresets } from './general.presets';
import { GeneralMiddlewares } from './general.middlewares';

@Update()
export class GeneralButtons {
  constructor(
    private readonly generalPresets: GeneralPresets,
    private readonly middlewares: GeneralMiddlewares,
  ) {}

  @Action('close_message')
  async closeMessageBtn(ctx: Context) {
    await this.middlewares.btnMiddleware(ctx, async (ctx: Context) => {
      await ctx.deleteMessage();
    });
  }

  @Action('latter')
  async latterBtn(ctx: Context) {
    await this.middlewares.btnMiddleware(ctx, async (ctx: Context) => {
      await this.generalPresets.sendTempMessage({
        ctx,
        text: '⏳ <b>Скоро...</b>',
        time: 2000,
      });
    });
  }
}
