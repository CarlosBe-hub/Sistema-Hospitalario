const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Enfermero extends Model {}

Enfermero.init({
  id_enfermero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  turno: DataTypes.STRING,
  nro_matricula: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Enfermero',
  tableName: 'enfermero',
  timestamps: false
});

module.exports = Enfermero;
