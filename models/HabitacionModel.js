const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Habitacion extends Model {}

Habitacion.init({
  id_habitacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  camas: DataTypes.INTEGER,
  genero: DataTypes.STRING,
  estado: DataTypes.STRING,
  ala: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Habitacion',
  tableName: 'habitacion',
  timestamps: false
});

module.exports = Habitacion;