import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { StartModule } from './start/start.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeneralModule } from './general/general.module';
import { validationSchema } from './libs/common';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './general/database/database.module';
import { ListenersModule } from './listeners/listeners.module';
import { ListenersLowModule } from './listeners/listeners-low.module';
import { BansModule } from './bans/bans.module';
import { ChainModule } from './libs/chain/chain.module';
import { RolesModule } from './roles/roles.module';
import { MailingsModule } from './mailings/mailings.module';
import { PaginationModule } from './libs/pagination/pagination.module';
import { FilesModule } from './files/files.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupsModule } from './backups/backups.module';
import { StarsModule } from './stars/stars.module';
import { PointsModule } from './points/points.module';
import { BoostsModule } from './boosts/boosts.module';
import { CoinsModule } from './coins/coins.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: [`.${process.env.NODE_ENV}.env`, `.env.stage.dev`],
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.get('BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    StartModule,
    GeneralModule,
    UsersModule,
    PaginationModule,
    ListenersModule,
    BansModule,
    ChainModule,
    RolesModule,
    MailingsModule,
    FilesModule,
    BackupsModule,
    StarsModule,
    PointsModule,
    BoostsModule,
    CoinsModule,
    TransactionsModule,

    ListenersLowModule,
  ],
})
export class AppModule {}
