const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Internacion = require('./InternacionModel');

class AltaMedica extends Model {}

AltaMedica.init({
  id_altamedica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instrucciones_cuidados: {
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
  }
}, {
  sequelize,
  modelName: 'AltaMedica',
  tableName: 'alta_medica',
  timestamps: false
});

module.exports = AltaMedica;