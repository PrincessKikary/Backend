'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Family extends Model {
    static associate(models) {
      Family.belongsToMany(models.Person, { through: 'PersonFamily', foreignKey: 'family_id' });
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
    }
  }, {
    sequelize,
    modelName: 'Family',
    tableName: 'Families'
  });
  return Family;
};