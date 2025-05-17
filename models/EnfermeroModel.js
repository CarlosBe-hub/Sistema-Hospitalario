const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Enfermero extends Model {}

Enfermero.init({
  id_enfermero: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  turno: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nro_matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  especialidad: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Activo'
  }
}, {
  sequelize,
  modelName: 'Enfermero',
  tableName: 'enfermero',
  timestamps: false
});

module.exports = Enfermero;