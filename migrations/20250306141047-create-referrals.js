'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Referrals', {
      id: {
        type: Sequelize.STRING(500),
        primaryKey: true,
        allowNull: false,
      },
      inviterUserId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      invitedUserId: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Referrals');
  },
};
