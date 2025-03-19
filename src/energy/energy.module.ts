import { Module } from '@nestjs/common';
import { EnergyController } from './energy.controller';
import { EnergyService } from './energy.service';
import { StarsModule } from 'src/stars/stars.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CustomCacheModule } from 'src/cache/cache.module';
import { EnergyUpdate } from './energy.update';
import { UsersModule } from 'src/users/users.module';
import { GeneralModule } from 'src/general/general.module';

@Module({
  imports: [
    StarsModule,
    CryptoModule,
    CustomCacheModule,
    UsersModule,
    GeneralModule,
  ],
  controllers: [EnergyController],
  providers: [EnergyService, EnergyUpdate],
})
export class EnergyModule {}
