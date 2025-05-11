const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class HistorialMedico extends Model {}

HistorialMedico.init({
  id_historialmedico: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Fecha: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  Medico_Acargo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Cuidados: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notas: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'HistorialMedico',
  tableName: 'HistorialMedico',
  timestamps: false
});

module.exports = HistorialMedico;