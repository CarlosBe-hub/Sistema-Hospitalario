const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Ajustá la ruta si es distinta
const Paciente = require('./PacienteModel');
const Internacion = require('./InternacionModel');

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
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Admision',
  tableName: 'admision',
  timestamps: false
});

module.exports = Admision;