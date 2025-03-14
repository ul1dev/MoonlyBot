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
  async getStatCommand(@Ctx() ctx: Context) {
    this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.adminsService.sendStatistic(ctx),
    );
  }

  @Command('getTopUsersByTaps')
  async getTopUsersByTapsCommand(@Ctx() ctx: Context) {
    this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.adminsService.getTopUsers(ctx, {
        paramName: 'totalTapsCount',
        messTitle: 'тапам',
      }),
    );
  }

  @Command('getTopUsersByInvites')
  async getTopUsersByInvitesCommand(@Ctx() ctx: Context) {
    this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.adminsService.getTopUsers(ctx, {
        paramName: 'invitedUsersCount',
        messTitle: 'приглашениям',
      }),
    );
  }
}
