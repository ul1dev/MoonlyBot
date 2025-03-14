import { Module } from '@nestjs/common';
import { EnergyController } from './energy.controller';
import { EnergyService } from './energy.service';
import { StarsModule } from 'src/stars/stars.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CustomCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [StarsModule, CryptoModule, CustomCacheModule],
  controllers: [EnergyController],
  providers: [EnergyService],
})
export class EnergyModule {}
