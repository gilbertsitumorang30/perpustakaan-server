const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");
const moment = require("moment");

const Pengembalian = db.define(
  "pengembalian",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    id_peminjaman: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
    },
    id_petugas: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    tanggal_kembali: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment().format("YYYY-MM-DD HH:mm:ss"),
    },
    status: {
      type: DataTypes.ENUM("telat", "tepat"),
      allowNull: false,
      defaultValue: "tepat",
    },
    denda: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    terlambat: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Pengembalian;
