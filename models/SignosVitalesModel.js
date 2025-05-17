const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Internacion = require('./InternacionModel');
const Enfermero = require('./EnfermeroModel');

class SignosVitales extends Model {}

SignosVitales.init({
  id_signos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false
  },
  temperatura: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  frecuencia_cardiaca: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  presion_arterial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  frecuencia_respiratoria: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
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
  id_enfermero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Enfermero,
      key: 'id_enfermero'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'SignosVitales',
  tableName: 'signos_vitales',
  timestamps: false
});

module.exports = SignosVitales;