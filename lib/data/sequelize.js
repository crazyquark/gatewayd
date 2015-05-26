
var Sequelize = require('sequelize');
var config = require(__dirname+'/../../config/environment.js');

var dbOptions = {
  dialect: config.get('DATABASE_DIALECT'),
  host: config.get('DATABASE_HOST'),
  port: config.get('DATABASE_PORT'),
  logging: config.get('DATABASE_LOGGING')
// XXX CS This breaks sequelize, the 'createdAt' field goes missing on returned objects causing havoc; see commit e0c2ac07631197bb73cc0fbd912dbecf9e6ff74a
//  define: {
//    timestamps: true,
//    updatedAt: '"updatedAt"',
//    createdAt: '"createdAt"'
//  }
};

var db = new Sequelize(config.get('DATABASE_NAME'), config.get('DATABASE_USER'), config.get('DATABASE_PASSWORD'), dbOptions);

module.exports = db;
