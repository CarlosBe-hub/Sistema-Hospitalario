const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class MotivoInternacion extends Model {}

MotivoInternacion.init({
  id_motivo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'MotivoInternacion',
  tableName: 'motivo_internacion',
  timestamps: false
});

module.exports = MotivoInternacion;