'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.ProjectUser = require('./project_user')(sequelize, Sequelize);
db.ConfUser = require('./conf_user')(sequelize, Sequelize);

db.ProjectUser.belongsTo(db.User, {foreignKey: 'email'});

db.User.associate = (models) => {
  db.User.hasMany(models.ProjectUser, {
      foreignKey: 'email',
      onDelete: 'cascade'
  });
};

module.exports = db;