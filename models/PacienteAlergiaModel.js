const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class PacienteAlergia extends Model {}

PacienteAlergia.init(
  {
    id_paciente_alergia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_alergia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    severidad: {
      type: DataTypes.ENUM("Leve", "Moderada", "Grave"),
      allowNull: false,
      defaultValue: "Moderada",
    },
    observaciones: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "PacienteAlergia",
    tableName: "paciente_alergia",
    timestamps: false,
  }
);

module.exports = PacienteAlergia;