const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Ala = require('./AlaModel');

class Habitacion extends Model {}

Habitacion.init({
  id_habitacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_ala: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ala',
      key: 'id_ala'
    }
  }
}, {
  sequelize,
  modelName: 'Habitacion',
  tableName: 'habitacion',
  timestamps: false
});

module.exports = Habitacion;
