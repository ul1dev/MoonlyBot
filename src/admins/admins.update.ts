import { Command, Ctx, Update } from 'nestjs-telegraf';
import { GeneralMiddlewares } from 'src/general/general.middlewares';
import { AdminsService } from './admins.service';
import { Context } from 'telegraf';

@Update()
export class AdminsUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly adminsService: AdminsService,
  ) {}

  @Command('getStat')
  async startCommand(@Ctx() ctx: Context) {
    this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.adminsService.sendStatistic(ctx),
    );
  }
}
