const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Admision extends Model {}

Admision.init({
  id_admision: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_motivo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_admision: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Admision',
  tableName: 'admision',
  timestamps: false
});

module.exports = Admision;