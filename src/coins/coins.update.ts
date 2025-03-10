import { Command, Ctx, Update } from 'nestjs-telegraf';
import { GeneralMiddlewares } from 'src/general/general.middlewares';
import { CoinsService } from './coins.service';
import { Context } from 'telegraf';

@Update()
export class CoinsUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly coinsService: CoinsService,
  ) {}

  @Command('giveCoins')
  async startCommand(@Ctx() ctx: Context) {
    await this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.coinsService.givePointsToUser(ctx),
    );
  }
}
