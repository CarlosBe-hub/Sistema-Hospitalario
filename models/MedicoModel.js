const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Medico extends Model {}

Medico.init({
  id_medico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nro_matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  especializacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Activo' // o 'Inactivo'
  }
}, {
  sequelize,
  modelName: 'Medico',
  tableName: 'medico',
  timestamps: false
});

module.exports = Medico;