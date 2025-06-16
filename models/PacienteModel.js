const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Paciente extends Model {}

Paciente.init(
  {
    id_paciente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    genero: DataTypes.STRING,
    dni: {
      type: DataTypes.STRING,
      unique: true,
    },
    altura: DataTypes.FLOAT,
    peso: DataTypes.FLOAT,
    fecha_nacimiento: DataTypes.DATE,
    telefono: DataTypes.STRING,
    contacto_emergencia: DataTypes.STRING,
    direccion: DataTypes.STRING,
    id_obra_social: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Activo",
    },
    es_nn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Paciente",
    tableName: "paciente",
    timestamps: false,
  }
);

module.exports = Paciente;
