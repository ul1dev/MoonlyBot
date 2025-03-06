import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Referral, ReferralCreationArgs } from '../models/referrals.model';

@Injectable()
export class ReferralRepository extends AbstractRepository<
  Referral,
  ReferralCreationArgs
> {
  protected readonly logger = new Logger(Referral.name);

  constructor(
    @InjectModel(Referral)
    private referralModel: typeof Referral,
  ) {
    super(referralModel);
  }
}
