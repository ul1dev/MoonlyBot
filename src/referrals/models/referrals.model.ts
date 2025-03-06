import { Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { AbstractModel } from 'src/libs/common';

export interface ReferralCreationArgs {
  inviterUserId: string;
  invitedUserId: string;
}

@Table({ tableName: 'Referrals', updatedAt: false })
export class Referral extends AbstractModel<Referral, ReferralCreationArgs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  inviterUserId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  invitedUserId: string;
}
