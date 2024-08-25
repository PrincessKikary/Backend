'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DnaTest extends Model {
    static associate(models) {
      DnaTest.belongsTo(models.Person, { foreignKey: 'person_id' });
    }
  }
  DnaTest.init({
    dna_test_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    person_id: DataTypes.UUID,
    test_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    test_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    results: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'DnaTest',
    tableName: 'DnaTests'
  });
  return DnaTest;

};