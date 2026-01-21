// -------------------------------------------------------------
// src/config/db.js
// -------------------------------------------------------------
const { Sequelize } = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host      : DB_HOST,
  dialect   : 'mariadb',
  logging   : false,         
  timezone  : '+01:00',       
});

module.exports = sequelize;   
