const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Tratamiento extends Model {}

Tratamiento.init({
  id_tratamiento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_internacion: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_medico: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_indicacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  terapias_procedimientos: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Terapias físicas, ocupacionales u otros procedimientos médicos'
  },
  medicamentos_dosis: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Medicamentos administrados y ajuste de dosis'
  },
  control_dolor: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Analgésicos y medicamentos apropiados para aliviar el dolor'
  },
  observaciones_evolucion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Evaluación continua de la respuesta del paciente al tratamiento'
  }
}, {
  sequelize,
  modelName: 'Tratamiento',
  tableName: 'tratamiento',
  timestamps: false
});

module.exports = Tratamiento;