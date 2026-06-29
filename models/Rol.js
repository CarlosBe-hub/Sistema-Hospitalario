const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

class Rol extends Model {}

Rol.init(
  {
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Rol",
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Rol;