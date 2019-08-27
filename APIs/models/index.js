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
db.Project = require('./project')(sequelize, Sequelize);
db.ProjectUser = require('./project_user')(sequelize, Sequelize);

db.User.belongsToMany(db.Project, { through:'project_user', foreignKey: 'email' });
db.Project.belongsToMany(db.User, { through:'project_user', foreignKey: 'projectName' });

module.exports = db;