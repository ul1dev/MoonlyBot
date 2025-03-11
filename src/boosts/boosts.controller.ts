import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { BuyBoostsDto } from './dto/buy-boosts.dto';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';

@UseInterceptors(SecureInterceptor)
@Controller('boosts')
export class BoostsController {
  constructor(private readonly boostsService: BoostsService) {}

  @Post('buy')
  async buyBoosts(@Body() body: BuyBoostsDto) {
    return this.boostsService.buyBoosts(body.userId, body.count);
  }
}
