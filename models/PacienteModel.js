const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ObraSocial = require('./ObraSocialModel');

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
  fecha_nacimiento: DataTypes.DATE,
  telefono: DataTypes.STRING,
  contacto_emergencia: DataTypes.STRING,
  direccion: DataTypes.STRING,

 
  id_obra_social: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ObraSocial,
      key: 'id_obra_social'
    }
  },

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


Paciente.belongsTo(ObraSocial, {
  foreignKey: 'id_obra_social',
  as: 'obraSocial'
});

module.exports = Paciente;