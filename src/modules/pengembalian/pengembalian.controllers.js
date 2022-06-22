const Pengembalian = require("./pengembalian.model");
const { QueryTypes } = require("sequelize");
const db = require("./../../config/database.connection");

exports.panggilSemuaPengembalian = async (req, res) => {
  try {
    const sql = `select pgm.id, pgm.tanggal_kembali, b.judul as judul_buku, a.nama as nama_anggota from pengembalian as pgm 
    join peminjaman as pjm on (pgm.id_peminjaman = pjm.id)
    join buku as b on (pjm.id_buku = b.id)
    join anggota as a on (pjm.id_anggota = a.id)`;
    const pengembalian = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil memanggil semua pengembalian",
      data: pengembalian,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilPengembalianById = async (req, res) => {
  try {
    const sql = `select pgm.id, pgm.tanggal_kembali, pgm.status, pgm.denda, pgm.terlambat, b.judul as judul_buku, a.nama as nama_anggota, p.nama as nama_petugas from pengembalian as pgm 
    join peminjaman as pjm on (pgm.id_peminjaman = pjm.id)
    join buku as b on (pjm.id_buku = b.id)
    join anggota as a on (pjm.id_anggota = a.id)
    join petugas as p on (pgm.id_petugas = p.id)
    where pgm.id = ${req.params.id}`;
    const pengembalian = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Data pengembalian berhasil di panggil",
      data: pengembalian[0],
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
