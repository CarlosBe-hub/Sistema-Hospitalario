const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Habitacion = require('./HabitacionModel');

class Cama extends Model {}

Cama.init({
  id_cama: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Habitacion,
      key: 'id_habitacion'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'Cama',
  tableName: 'cama',
  timestamps: false
});

module.exports = Cama;
