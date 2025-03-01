import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { getCtxData } from 'src/libs/common';
import { UserRepository } from './repositories/user.repository';
import { UserRolesRepository } from 'src/roles/repositories/user-roles.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRolesRepository: UserRolesRepository,
  ) {}

  async updateUserNamesByCtx(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    const telegramId = ctxUser.id;
    const firstName = ctxUser.first_name;
    const lastName = ctxUser.last_name;
    const userName = ctxUser.username;

    await this.userRepository.update(
      { firstName, lastName, userName },
      { where: { telegramId } },
    );

    if (telegramId == process.env.CODER_TG_ID) {
      const user = await this.userRepository.findByTgId(telegramId);

      if (user) {
        await this.userRolesRepository.findOrCreate({
          where: {
            userId: user.id,
            roleName: 'SUPER_ADMIN',
          },
          defaults: {
            userId: user.id,
            roleName: 'SUPER_ADMIN',
          },
        });
      }
    }
  }

  async findOrCreateUserByCtx(ctx: Context | any) {
    const { ctxUser } = getCtxData(ctx);
    const { id, first_name, last_name, username } = ctxUser;

    const isCreated = await this.userRepository.findByTgId(id);
    if (isCreated) return isCreated;

    const user = await this.userRepository.create({
      telegramId: id,
      firstName: first_name?.trim(),
      lastName: last_name?.trim(),
      userName: username?.trim(),
    });

    return user;
  }
}
