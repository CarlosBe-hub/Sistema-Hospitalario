const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class MotivoAdmision extends Model {}

MotivoAdmision.init({
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
  modelName: 'MotivoAdmision',
  tableName: 'motivo_admision',
  timestamps: false
});

module.exports = MotivoAdmision;
