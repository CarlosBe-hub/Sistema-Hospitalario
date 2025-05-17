const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./PacienteModel');
const Medico = require('./MedicoModel'); 

class Diagnostico extends Model {}

Diagnostico.init({
  id_diagnostico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente'
    },
    onDelete: 'CASCADE'
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Medico,
      key: 'id_medico'
    },
    onDelete: 'SET NULL'
  }
}, {
  sequelize,
  modelName: 'Diagnostico',
  tableName: 'diagnostico',
  timestamps: false
});

module.exports = Diagnostico;