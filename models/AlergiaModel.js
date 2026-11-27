const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Alergia extends Model {}

Alergia.init(
  {
    id_alergia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    categoria: {
      type: DataTypes.ENUM("Medicamento", "Alimento", "Ambiental", "Otro"),
      allowNull: false,
      defaultValue: "Medicamento",
    },
  },
  {
    sequelize,
    modelName: "Alergia",
    tableName: "alergia",
    timestamps: false,
  }
);

module.exports = Alergia;