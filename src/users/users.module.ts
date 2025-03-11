import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/libs/common';
import { User } from './models/user.model';
import { UserRepository } from './repositories/user.repository';
import { RolesModule } from 'src/roles/roles.module';
import { UsersController } from './users.controller';
import { ReferralsModule } from 'src/referrals/referrals.module';
import { CryptoModule } from 'src/crypto/crypto.module';
import { CustomCacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    DatabaseModule.forFeature([User]),
    RolesModule,
    ReferralsModule,
    CryptoModule,
    CustomCacheModule,
  ],
  providers: [UsersService, UserRepository],
  exports: [UserRepository, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
