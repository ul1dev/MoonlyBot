import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { AddFarmedPointsDto } from './dto/add-farmed-points.dto';

@Injectable()
export class PointsService {
  constructor(private readonly userRepository: UserRepository) {}

  async addFarmed(data: AddFarmedPointsDto) {
    const { userId, tapsCount } = data;

    const user = await this.userRepository.findByPk(userId);

    if (!user) return;

    // ВЫСЧИТЫВАТЬ СКОЛЬКО tapsCount ПРИБАВЛЯТЬ В ЗАВИСИМОСТИ ОТ КОЛЛИЧЕСТВА ЛЕВЕЛА

    // ЕСЛИ ЧЕЛ ДОСТИГ КАКОГО ТО КОЛИЧЕСТВА ТАПОВ ИЗ КОНФИГА, ПОВЫШАТЬ ЕГО ЛЕВЕЛ

    user.pointsBalance += tapsCount;
    await user.save();

    return { pointsBalance: user.pointsBalance };
  }
}

// СДЕЛАТЬ ГЛОБАЛЬНЫЕ ВАЛИДАЦИИ ЗАПРОСОВ И ШИФРОВАНИЕ

// ПЕРЕДЕЛДАТЬ ВСЕ ВЫЧИСЛЕНИЯ С ПОИНТАМИ ПОД ОЧЕНЬ БОЛЬШИЕ ЧИСЛА
