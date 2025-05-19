const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class ObraSocial extends Model {}

ObraSocial.init({
  id_obra_social: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING
}, {
  sequelize,
  modelName: 'ObraSocial',
  tableName: 'obras_sociales',
  timestamps: false
});

module.exports = ObraSocial;