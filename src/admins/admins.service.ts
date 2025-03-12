import { Injectable } from '@nestjs/common';
import { getCtxData } from 'src/libs/common';
import { UserRepository } from 'src/users/repositories/user.repository';
import { Context } from 'telegraf';
import * as Sequelize from 'sequelize';
import { Op } from 'sequelize';
import { UAParser } from 'ua-parser-js';
import { sendMessage } from 'src/general';
import { statsMessage } from './responses';

interface AvgStats {
  avgTaps: number;
  avgPoints: number;
  avgCoins: number;
  avgBoosts: number;
  avgLevel: number;
  avgInvites: number;
}

@Injectable()
export class AdminsService {
  constructor(private readonly userRepository: UserRepository) {}

  async sendStatistic(ctx: Context) {
    const { ctxUser } = getCtxData(ctx);
    if (ctxUser.id != process.env.CODER_TG_ID) return;

    try {
      const totalUsers = await this.userRepository.count();

      const avgStats = (await this.userRepository.findOne({
        attributes: [
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('totalTapsCount'), 'UNSIGNED'),
            ),
            'avgTaps',
          ],
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('pointsBalance'), 'UNSIGNED'),
            ),
            'avgPoints',
          ],
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('coinsBalance'), 'UNSIGNED'),
            ),
            'avgCoins',
          ],
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('boostsBalance'), 'FLOAT'),
            ),
            'avgBoosts',
          ],
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('level'), 'FLOAT'),
            ),
            'avgLevel',
          ],
          [
            Sequelize.fn(
              'AVG',
              Sequelize.cast(Sequelize.col('invitedUsersCount'), 'FLOAT'),
            ),
            'avgInvites',
          ],
        ],
        raw: true,
      })) as unknown as AvgStats;

      const newUsers = {
        today: await this.userRepository.count({
          where: { createdAt: { [Op.gte]: this.getStartOfPeriod('day') } },
        }),
        week: await this.userRepository.count({
          where: { createdAt: { [Op.gte]: this.getStartOfPeriod('week') } },
        }),
        month: await this.userRepository.count({
          where: { createdAt: { [Op.gte]: this.getStartOfPeriod('month') } },
        }),
      };

      const onlineUsers = {
        today: await this.userRepository.count({
          where: { lastLogin: { [Op.gte]: this.getStartOfPeriod('day') } },
        }),
        week: await this.userRepository.count({
          where: { lastLogin: { [Op.gte]: this.getStartOfPeriod('week') } },
        }),
        month: await this.userRepository.count({
          where: { lastLogin: { [Op.gte]: this.getStartOfPeriod('month') } },
        }),
      };

      const userAgents = await this.userRepository.findAll({
        attributes: ['userAgent'],
        where: {
          userAgent: {
            [Op.not]: null,
            [Op.ne]: '',
          },
        },
        raw: true,
      });

      const osStats = {};
      const deviceStats = {};

      userAgents.forEach(({ userAgent }) => {
        if (!userAgent) return;

        const { os, device } = this.parseDeviceInfo(userAgent);

        osStats[os] = (osStats[os] || 0) + 1;
        deviceStats[device] = (deviceStats[device] || 0) + 1;
      });

      const topOS =
        Object.entries(osStats).sort((a, b) => +b[1] - +a[1])[0]?.[0] || 'N/A';
      const topDevice =
        Object.entries(deviceStats).sort((a, b) => +b[1] - +a[1])[0]?.[0] ||
        'N/A';

      const message = statsMessage({
        totalUsers: this.formatNumber(totalUsers),
        newUsersToday: this.formatNumber(newUsers.today),
        newUsersWeek: this.formatNumber(newUsers.week),
        newUsersMonth: this.formatNumber(newUsers.month),
        avgTaps: this.formatNumber(avgStats.avgTaps),
        avgPoints: this.formatNumber(avgStats.avgPoints),
        avgCoins: this.formatNumber(avgStats.avgCoins),
        avgBoosts: avgStats.avgBoosts?.toFixed(1),
        avgLevel: avgStats.avgLevel?.toFixed(1),
        avgInvites: avgStats.avgInvites?.toFixed(1),
        onlineUsersToday: this.formatNumber(onlineUsers.today),
        onlineUsersWeek: this.formatNumber(onlineUsers.week),
        onlineUsersMonth: this.formatNumber(onlineUsers.month),
        topOS,
        topDevice,
      });

      sendMessage(message, { ctx, isBanner: false, type: 'send' });
    } catch (e) {
      console.error('Error on send stat:', e);
    }
  }

  private getStartOfPeriod(period: 'day' | 'week' | 'month') {
    const now = new Date();
    const start = new Date(now);

    switch (period) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        break;
    }

    return start;
  }

  private formatNumber(
    value: string | number | null | undefined,
    fixed: number = 0,
  ): string {
    try {
      const num =
        typeof value === 'string'
          ? parseFloat(value.replace(',', '.'))
          : Number(value || 0);

      if (isNaN(num)) return '0';

      return fixed > 0
        ? num.toFixed(fixed)
        : new Intl.NumberFormat('ru-RU').format(num);
    } catch {
      return '0';
    }
  }

  private parseDeviceInfo(ua: string) {
    const parser = new UAParser(ua);
    const result = parser.getResult();

    let device = result.device.model || '';
    const os = result.os.name || 'Unknown OS';

    if (ua.includes('Telegram-Android')) {
      const tgInfoMatch = ua.match(/\(([^)]+)\)/g);
      if (tgInfoMatch && tgInfoMatch.length > 1) {
        const deviceInfo = tgInfoMatch[tgInfoMatch.length - 1]
          .slice(1, -1)
          .split(';')
          .find(
            (part) =>
              !part.includes('SDK') &&
              !part.includes('Android') &&
              !part.trim().match(/^[\d_]+$/),
          );

        if (deviceInfo) {
          device = deviceInfo.trim();
        }
      }
    } else if (ua.includes('iPhone')) {
      device = 'iPhone';
    } else if (result.device.vendor === 'Apple') {
      device = result.device.model || 'Apple Device';
    }

    return {
      os: os,
      device: device || result.device.type || 'Unknown Device',
    };
  }
}
