'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.Person, { foreignKey: 'person_id' });
    }
  }
  Document.init({
    document_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    person_id: DataTypes.UUID,
    document_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: DataTypes.TEXT
    }, {
    sequelize,
    modelName: 'Document',
    });
    return Document;
    };