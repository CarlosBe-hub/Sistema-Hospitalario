const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Medico extends Model {}

Medico.init({
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  apellido: DataTypes.STRING,
  nro_matricula: DataTypes.STRING,
  especializacion: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Medico',
  tableName: 'medico',
  timestamps: false
});

module.exports = Medico;