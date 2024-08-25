'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate(models) {
      Person.hasMany(models.Relationship, { as: 'Relationships1', foreignKey: 'person1_id' });
      Person.hasMany(models.Relationship, { as: 'Relationships2', foreignKey: 'person2_id' });
      Person.hasMany(models.Event, { foreignKey: 'person_id' });
      Person.hasMany(models.Document, { foreignKey: 'person_id' });
      Person.hasMany(models.DnaTest, { foreignKey: 'person_id' });
      Person.hasMany(models.PersonAlias, { foreignKey: 'person_id' });
      Person.belongsToMany(models.Family, { through: 'PersonFamily', foreignKey: 'person_id' });
    }
  }
  Person.init({
    person_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    birth_date: DataTypes.DATE,
    death_date: DataTypes.DATE,
    gender: DataTypes.ENUM('male', 'female', 'other'),
    birth_place: DataTypes.STRING(100),
    death_place: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Person',
  });
  return Person;
};