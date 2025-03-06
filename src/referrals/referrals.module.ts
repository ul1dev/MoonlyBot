import { Module } from '@nestjs/common';
import { ReferralRepository } from './repositories/referrals.repository';
import { DatabaseModule } from 'src/libs/common';
import { Referral } from './models/referrals.model';

@Module({
  imports: [DatabaseModule.forFeature([Referral])],
  providers: [ReferralRepository],
  exports: [ReferralRepository],
})
export class ReferralsModule {}
