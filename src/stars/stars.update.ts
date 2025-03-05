import { Ctx, On, Update } from 'nestjs-telegraf';
import { StarsService } from './stars.service';
import { Context } from 'telegraf';

@Update()
export class StarsUpdate {
  constructor(private readonly starsService: StarsService) {}

  @On('pre_checkout_query')
  async preCheckoutQuery(@Ctx() ctx: Context) {
    await ctx.answerPreCheckoutQuery(true);
  }

  @On('successful_payment')
  successfulPayment(@Ctx() ctx: Context) {
    this.starsService.onSuccessfulPayment(ctx);
  }
}
