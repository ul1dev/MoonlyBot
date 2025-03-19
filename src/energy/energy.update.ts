import { Command, Ctx, Update } from 'nestjs-telegraf';
import { GeneralMiddlewares } from 'src/general/general.middlewares';
import { Context } from 'telegraf';
import { EnergyService } from './energy.service';

@Update()
export class EnergyUpdate {
  constructor(
    private readonly middlewares: GeneralMiddlewares,
    private readonly energyService: EnergyService,
  ) {}

  @Command('giveEnergy')
  async startCommand(@Ctx() ctx: Context) {
    await this.middlewares.commandMiddleware(ctx, (ctx: Context) =>
      this.energyService.giveEnergyToUser(ctx),
    );
  }
}
