const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Especializacion extends Model {}

Especializacion.init({
  id_especializacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Especializacion',
  tableName: 'especializacion',
  timestamps: false
});

module.exports = Especializacion;