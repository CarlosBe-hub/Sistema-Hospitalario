const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Internacion extends Model {}

Internacion.init({
  id_internacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Activa', 'Finalizada', 'Cancelada']]
    }
  },
  id_habitacion: DataTypes.INTEGER,
  id_paciente: DataTypes.INTEGER,
  id_motivo: DataTypes.INTEGER,
  id_cama: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'Internacion',
  tableName: 'internacion',
  timestamps: false
});

module.exports = Internacion;
