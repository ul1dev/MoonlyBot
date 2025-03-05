import { Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { UserRoles } from 'src/roles/models/user-roles.model';

export interface UserCreationArgs {
  telegramId: string;
  firstName: string;
  lastName: string;
  userName: string;
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
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  totalTapsCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  pointsBalance: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  coinsBalance: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  boostsBalance: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  level: number;

  @Column({
    type: DataType.DATE,
  })
  lastLogin: Date;

  @HasMany(() => UserRoles)
  roles: UserRoles[];
}
