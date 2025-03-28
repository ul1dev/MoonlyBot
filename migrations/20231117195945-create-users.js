'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      telegramId: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING(100),
      },
      lastName: {
        type: Sequelize.STRING(100),
      },
      userName: {
        type: Sequelize.STRING(100),
      },
      ip: {
        type: Sequelize.STRING(100),
      },
      userAgent: {
        type: Sequelize.STRING(500),
      },
      totalTapsCount: {
        type: Sequelize.STRING(500),
        defaultValue: '0',
      },
      pointsBalance: {
        type: Sequelize.STRING(500),
        defaultValue: '0',
      },
      coinsBalance: {
        type: Sequelize.STRING(500),
        defaultValue: '0',
      },
      boostsBalance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      invitedUsersCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      energy: {
        type: Sequelize.INTEGER,
        defaultValue: 1000,
      },
      maxEnergy: {
        type: Sequelize.INTEGER,
        defaultValue: 1000,
      },
      lastEnergyUpdate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      lastLogin: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('Users');
  },
};
