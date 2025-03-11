import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { PointsService } from './points.service';
import { AddFarmedPointsDto } from './dto/add-farmed-points.dto';
import { SecureInterceptor } from 'src/interceptors/secure.interceptor';

@UseInterceptors(SecureInterceptor)
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('add-farmed')
  async addFarmed(@Body() body: AddFarmedPointsDto) {
    return this.pointsService.addFarmed(body);
  }
}
