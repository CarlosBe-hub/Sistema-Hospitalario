const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./PacienteModel');

class ContactoEmergencia extends Model {}

ContactoEmergencia.init({
  id_contactoemergencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente'
    },
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: 'ContactoEmergencia',
  tableName: 'contacto_emergencia',
  timestamps: false
});

module.exports = ContactoEmergencia;