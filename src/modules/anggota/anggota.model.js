const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");
const moment = require("moment");

const Anggota = db.define(
  "anggota",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_kelas: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    nomor_induk_siswa: {
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
      allowNull: true,
    },
    nomor_telepon: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terakhir_masuk: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Anggota;
