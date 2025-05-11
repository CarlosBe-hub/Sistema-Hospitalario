const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class CuidadosEnfermeria extends Model {}

CuidadosEnfermeria.init({
  id_cuidado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_enfermero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  signos_vitales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medicacion_administrada: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'CuidadosEnfermeria',
  tableName: 'CuidadosEnfermeria',
  timestamps: false
});

module.exports = CuidadosEnfermeria;