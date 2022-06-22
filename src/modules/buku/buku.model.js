const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");

const Buku = db.define(
  "buku",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      allowNull: false,
    },
    id_kategori: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
    },
    judul: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    foto: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    penulis: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    penerbit: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    jumlah_halaman: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    bahasa: {
      type: DataTypes.TEXT(100),
      allowNull: false,
    },
    stok: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sinopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tahun_terbit: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Buku;
