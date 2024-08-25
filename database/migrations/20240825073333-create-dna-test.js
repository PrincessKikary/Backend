'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DnaTests', {
      dna_test_id: {
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
      test_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      test_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      results: {
        type: Sequelize.JSON
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
    await queryInterface.dropTable('DnaTests');
  }
};