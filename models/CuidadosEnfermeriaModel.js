const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./PacienteModel');
const Enfermero = require('./EnfermeroModel');
const Internacion = require('./InternacionModel');

class CuidadosEnfermeria extends Model {}

CuidadosEnfermeria.init({
  id_cuidados: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: { 
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  
  plan_cuidados: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  intervenciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medicamentos_administrados: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
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
  id_enfermero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Enfermero,
      key: 'id_enfermero'
    },
    onDelete: 'CASCADE'
  },
  id_internacion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Internacion,
      key: 'id_internacion'
    },
    onDelete: 'SET NULL'
  }
}, {
  sequelize,
  modelName: 'CuidadosEnfermeria',
  tableName: 'cuidados_enfermeria',
  timestamps: false
});

module.exports = CuidadosEnfermeria;