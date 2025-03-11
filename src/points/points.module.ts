import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';
import { UsersModule } from 'src/users/users.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CustomCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [UsersModule, CryptoModule, CustomCacheModule],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
