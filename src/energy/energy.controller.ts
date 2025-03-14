import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { EnergyService } from './energy.service';
import { BuyEnergyWithStarsDto } from './dto/buy-energy-with-stars.dto';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';

@UseInterceptors(SecureInterceptor)
@Controller('energy')
export class EnergyController {
  constructor(private readonly energyService: EnergyService) {}

  @Post('buy/stars')
  async buyWithStars(@Body() body: BuyEnergyWithStarsDto) {
    return this.energyService.buyWithStars(body.userId, body.count);
  }
}
