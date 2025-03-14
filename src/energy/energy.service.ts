import { Injectable } from '@nestjs/common';
import { StarsService } from 'src/stars/stars.service';

@Injectable()
export class EnergyService {
  constructor(private readonly starsService: StarsService) {}

  async buyWithStars(userId: string, count: number) {
    return this.starsService.createEnergyTransaction(userId, count);
  }
}
