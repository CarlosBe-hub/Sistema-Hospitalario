const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class ObraSocial extends Model {}

ObraSocial.init({
  id_obrasocial: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING
}, {
  sequelize,
  modelName: 'ObraSocial',
  tableName: 'obra_social',
  timestamps: false
});

module.exports = ObraSocial;