const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Ala extends Model {}

Ala.init({
  id_ala: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'Ala',
  tableName: 'ala',
  timestamps: false
});

module.exports = Ala;