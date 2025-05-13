const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Paciente extends Model {}

Paciente.init({
  id_paciente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: DataTypes.STRING,
  apellido: DataTypes.STRING,
  genero: DataTypes.STRING,
  dni: DataTypes.STRING,
  altura: DataTypes.FLOAT,
  peso: DataTypes.FLOAT,
  prepaga: DataTypes.STRING,
  fecha_nacimiento: DataTypes.DATE,
  telefono: DataTypes.STRING,
  contacto_emergencia: DataTypes.STRING,
  direccion: DataTypes.STRING,

  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Activo'
  }

}, {
  sequelize,
  modelName: 'Paciente',
  tableName: 'paciente',
  timestamps: false
});

module.exports = Paciente;