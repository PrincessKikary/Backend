'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      event_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      person_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Persons',
          key: 'person_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      event_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      event_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      event_place: {
        type: Sequelize.STRING(100)
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};