import { Ctx, On, Update } from 'nestjs-telegraf';
import { StarsService } from './stars.service';
import { Context } from 'telegraf';

@Update()
export class StarsUpdate {
  constructor(private readonly starsService: StarsService) {}

  @On('pre_checkout_query')
  async preCheckoutQuery(@Ctx() ctx: Context) {
    try {
      await ctx.answerPreCheckoutQuery(true);
    } catch (error) {
      console.error('Error in pre_checkout_query:', error);
    }
  }

  @On('successful_payment')
  successfulPayment(@Ctx() ctx: Context) {
    this.starsService.onSuccessfulPayment(ctx);
  }
}
