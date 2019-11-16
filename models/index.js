const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let db = {};
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

fs.readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        let model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });
module.exports = db;