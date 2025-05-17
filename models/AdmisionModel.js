const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./PacienteModel');
const Internacion = require('./InternacionModel');
const Habitacion = require('./HabitacionModel');

class Admision extends Model {}

Admision.init({
  id_admision: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  id_internacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Internacion,
      key: 'id_internacion'
    },
    onDelete: 'CASCADE'
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Habitacion,
      key: 'id_habitacion'
    },
    onDelete: 'CASCADE'
  },
  fecha_admision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  diagnostico: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Admision',
  tableName: 'admision',
  timestamps: false
});

module.exports = Admision;