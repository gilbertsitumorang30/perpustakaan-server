const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");

const Kategori = db.define(
  "kategori",
  {
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    kategori: {
      type: DataTypes.TEXT(200),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Kategori;
