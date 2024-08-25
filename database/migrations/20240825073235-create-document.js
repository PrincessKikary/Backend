'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Documents', {
      document_id: {
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
      document_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      upload_date: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('Documents');
  }
};