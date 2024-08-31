'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Family extends Model {
    static associate(models) {
      Family.belongsToMany(models.Person, { through: 'PersonFamily', foreignKey: 'family_id' });
      Family.belongsTo(models.User, { foreignKey: 'created_by' });
    }
  }
  Family.init({
    family_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    family_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    founding_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
  }, {
    sequelize,
    modelName: 'Family',
    tableName: 'Families'
  });
  return Family;
};