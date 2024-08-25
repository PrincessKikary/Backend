'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonFamily extends Model {
    static associate(models) {
      // This model serves as a junction table, so it doesn't need direct associations
    }
  }
  PersonFamily.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    person_id: DataTypes.UUID,
    family_id: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'PersonFamily',
    tableName: 'PersonFamilies'
  });
  return PersonFamily;
};