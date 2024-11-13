import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import db from './db.js'
import { typeDefs } from './schema.js'


const resolvers = {
  Query: {
    family() {
      return db.family.map(family =>({
        ...family,
        members: db.person.filter(person=> person.familyId === family.id)
      }))
    },
    person() {
      return db.person.map(person => ({
        ...person,
        family: db.family.find(family => family.id === person.familyId),
        relationships: db.relationship
          .filter(rel => rel.person1Id === person.id || rel.person2Id === person.id)
          .map(rel => ({
            id:rel.id,
            type:rel.type,
            person:db.person.find(p => p.id === (rel.person1Id === person.id ? rel.person2Id :rel.personId))
          }))
      }))
    },
    relationship() {
      return db.relationship.map(rel => ({
        id: rel.id,
        type:rel.type,
        person: db.person.find(p => p.id === rel.person2Id)
      }))
    }
  }
}

// server setup 
const server = new ApolloServer({
  typeDefs,

})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log('Server ready at port', 4000)





 

 














/*'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;*/
