const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Habitacion = require('./HabitacionModel');
const Paciente = require('./PacienteModel');
const MotivoInternacion = require('./MotivoInternacionModel');

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
  diagnostico: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Activa', 'Finalizada', 'Cancelada']]
    }
  },
  id_habitacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Habitacion,
      key: 'id_habitacion'
    },
    onDelete: 'CASCADE'
  },
  id_paciente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Paciente,
      key: 'id_paciente'
    },
    onDelete: 'CASCADE'
  },
  id_motivo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: MotivoInternacion,
      key: 'id_motivo'
    },
    onDelete: 'SET NULL'
  }
}, {
  sequelize,
  modelName: 'Internacion',
  tableName: 'internacion',
  timestamps: false
});

// Relaciones
Internacion.belongsTo(Habitacion, {
  foreignKey: 'id_habitacion',
  as: 'habitacion'
});

Internacion.belongsTo(Paciente, {
  foreignKey: 'id_paciente',
  as: 'paciente'
});

Internacion.belongsTo(MotivoInternacion, {
  foreignKey: 'id_motivo',
  as: 'motivo'
});

module.exports = Internacion;
