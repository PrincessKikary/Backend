'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PersonAlias extends Model {
    static associate(models) {
      PersonAlias.belongsTo(models.Person, { foreignKey: 'person_id' });
    }
  }
  PersonAlias.init({
    alias_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    person_id: DataTypes.UUID,
    alias_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    alias_type: DataTypes.STRING(50)
  }, {
    sequelize,
    modelName: 'PersonAlias',
  });
  return PersonAlias;
};