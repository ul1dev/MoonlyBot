import { Body, Controller, Post } from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { BuyBoostsDto } from './dto/buy-boosts.dto';

@Controller('boosts')
export class BoostsController {
  constructor(private readonly boostsService: BoostsService) {}

  @Post('buy')
  async buyBoosts(@Body() body: BuyBoostsDto) {
    return this.boostsService.buyBoosts(body.userId, body.count);
  }
}
