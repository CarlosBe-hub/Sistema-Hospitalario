const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class AltaMedica extends Model {}

AltaMedica.init({
  id_altamedica: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Fecha_Salida: {
    type: DataTypes.DATE, 
    allowNull: false
  },
  instrucciones_cuidados: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'AltaMedica',
  tableName: 'AltaMedica',
  timestamps: false
});

module.exports = AltaMedica;