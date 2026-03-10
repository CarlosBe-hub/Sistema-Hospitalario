const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./PacienteModel');
const Medico = require('./MedicoModel');
const Enfermero = require('./EnfermeroModel'); 
const Internacion = require('./InternacionModel'); 

class HistorialMedico extends Model {}

HistorialMedico.init({
  id_historialmedico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW 
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: true 
  },
  motivo_internacion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sintomas_principales: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  enfermedades_previas: { type: DataTypes.TEXT },
  cirugias: { type: DataTypes.TEXT },
  alergias: { type: DataTypes.TEXT },
  medicamentos_actuales: { type: DataTypes.TEXT },
  antecedentes_familiares: { type: DataTypes.TEXT },
  
  
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'medico', 
      key: 'id_medico'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  id_enfermero: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'enfermero',
      key: 'id_enfermero'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'paciente',
      key: 'id_paciente'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  id_internacion: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'internacion',
      key: 'id_internacion'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'HistorialMedico',
  tableName: 'historialmedico',
  timestamps: false
});

module.exports = HistorialMedico;