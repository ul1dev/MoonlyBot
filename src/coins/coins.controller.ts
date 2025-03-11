import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { BuyCoinsWithPointsDto } from './dto/buy-coins-with-points.dto';
import { BuyCoinsWithStarsDto } from './dto/buy-coins-with-stars.dto';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';

@UseInterceptors(SecureInterceptor)
@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post('buy/points')
  async buyWithPoints(@Body() body: BuyCoinsWithPointsDto) {
    return this.coinsService.buyWithPoints(body.userId, body.count);
  }

  @Post('buy/stars')
  async buyWithStars(@Body() body: BuyCoinsWithStarsDto) {
    return this.coinsService.buyWithStars(body.userId, body.count);
  }
}
