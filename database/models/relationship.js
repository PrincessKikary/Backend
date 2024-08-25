'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    static associate(models) {
      Relationship.belongsTo(models.Person, { as: 'Person1', foreignKey: 'person1_id' });
      Relationship.belongsTo(models.Person, { as: 'Person2', foreignKey: 'person2_id' });
    }
  }
  Relationship.init({
    relationship_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    person1_id: DataTypes.UUID,
    person2_id: DataTypes.UUID,
    relationship_type: {
      type: DataTypes.ENUM('parent-child', 'spouse', 'sibling'),
      allowNull: false
    },
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Relationship',
  });
  return Relationship;
};