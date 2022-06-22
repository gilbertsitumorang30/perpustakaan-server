const { DataTypes } = require("sequelize");
const db = require("../../config/database.connection");
const moment = require("moment");

const Peminjaman = db.define(
  "peminjaman",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    id_anggota: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    id_petugas: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
    },
    id_buku: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    tanggal_pinjam: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tanggal_pesan: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tanggal_harus_kembali: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("menunggu", "ditolak", "diterima", "kembali"),
      allowNull: false,
      defaultValue: "menunggu",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = Peminjaman;
