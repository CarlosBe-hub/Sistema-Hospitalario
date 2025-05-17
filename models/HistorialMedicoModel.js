const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./PacienteModel');
const Medico = require('./MedicoModel');

class HistorialMedico extends Model {}

HistorialMedico.init({
  id_historialmedico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  medico_acargo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cuidados: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medico,
      key: 'id_medico'
    },
    onDelete: 'CASCADE'
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'HistorialMedico',
  tableName: 'historialmedico',
  timestamps: false
});

module.exports = HistorialMedico;