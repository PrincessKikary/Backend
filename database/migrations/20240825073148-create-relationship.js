'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Relationships', {
      relationship_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      person1_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Persons',
          key: 'person_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      person2_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Persons',
          key: 'person_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      relationship_type: {
        type: Sequelize.ENUM('parent-child', 'spouse', 'sibling'),
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Relationships');
  }
};