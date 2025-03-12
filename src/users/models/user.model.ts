import { Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { UserRoles } from 'src/roles/models/user-roles.model';

export interface UserCreationArgs {
  telegramId: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  ip?: string;
  userAgent?: string;
}

@Table({ tableName: 'Users' })
export class User extends AbstractModel<User, UserCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  telegramId: string;

  @Column({
    type: DataType.STRING,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
  })
  userName: string;

  @Column({
    type: DataType.STRING,
  })
  ip: string;

  @Column({
    type: DataType.STRING,
  })
  userAgent: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '0',
  })
  totalTapsCount: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '0',
  })
  pointsBalance: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '0',
  })
  coinsBalance: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  boostsBalance: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  level: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  invitedUsersCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 10000,
  })
  energy: number;

  @Column({
    type: DataType.DATE,
  })
  lastEnergyUpdate: Date;

  @Column({
    type: DataType.DATE,
  })
  lastLogin: Date;

  @HasMany(() => UserRoles)
  roles: UserRoles[];
}
