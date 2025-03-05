import { Body, Controller, Post } from '@nestjs/common';
import { PointsService } from './points.service';
import { AddFarmedPointsDto } from './dto/add-farmed-points.dto';

@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post('add-farmed')
  async addFarmed(@Body() body: AddFarmedPointsDto) {
    return this.pointsService.addFarmed(body);
  }
}
