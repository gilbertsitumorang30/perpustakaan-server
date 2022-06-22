const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");

const Petugas = db.define(
  "petugas",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nomor_induk_pegawai: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    nama: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    jenis_kelamin: {
      type: DataTypes.ENUM("P", "L"),
      allowNull: false,
    },
    nomor_telepon: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    alamat: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Petugas;
