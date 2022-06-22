const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");

const Kelas = db.define(
  "kelas",
  {
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    kelas: {
      type: DataTypes.TEXT(200),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Kelas;
