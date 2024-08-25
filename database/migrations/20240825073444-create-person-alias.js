'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PersonAliases', {
      alias_id: {
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
        onDelete: 'CASCADE'
      },
      alias_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      alias_type: {
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('PersonAliases');
  }
};