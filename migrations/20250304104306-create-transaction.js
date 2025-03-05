'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.STRING(500),
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING(500),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.STRING(100),
        defaultValue: 'PROCESSING',
      },
      currency: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      count: Sequelize.INTEGER,
      amount: Sequelize.INTEGER,
      productTitle: Sequelize.STRING(255),
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('Transactions');
  },
};
