const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Habitacion = require('./HabitacionModel');
const Paciente = require('./PacienteModel');

class Internacion extends Model {}

Internacion.init({
  id_internacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_ingreso: DataTypes.DATE,
  fecha_salida: DataTypes.DATE,
  diagnostico: DataTypes.STRING,
  estado: DataTypes.STRING,
  id_habitacion: {
    type: DataTypes.INTEGER,
    references: {
      model: Habitacion,
      key: 'id_habitacion'
    },
    onDelete: 'CASCADE'
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    references: {
      model: Paciente,
      key: 'id_paciente'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'Internacion',
  tableName: 'internacion',
  timestamps: false
});

module.exports = Internacion;