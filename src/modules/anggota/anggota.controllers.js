const jwt = require("jsonwebtoken");
const Anggota = require("./anggota.model");
const Peminjaman = require("../peminjaman/peminjaman.model");
const Pengembalian = require("../pengembalian/pengembalian.model");
const hapusFoto = require("../../utils/hapusFoto");
const { QueryTypes } = require("sequelize");
const db = require("../../config/database.connection");
const moment = require("moment");
const Buku = require("../buku/buku.model");

exports.tambahAnggota = async (req, res) => {
  const {
    id_kelas,
    nomor_induk_siswa,
    nama,
    password,
    jenis_kelamin,
    nomor_telepon,
    alamat,
  } = req.body;
  console.log(req.body);
  try {
    let foto =
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
    if (req.file) {
      hapusFoto(foto);
      foto =
        req.protocol +
        "://" +
        req.get("host") +
        "/uploads" +
        "/" +
        req.file.filename;
    }
    console.log("body:", req.body);
    console.log("file:", req.file);
    await Anggota.create({
      foto: foto,
      id_kelas: id_kelas,
      nomor_induk_siswa: nomor_induk_siswa,
      nama: nama,
      password: password,
      alamat: alamat,
      nomor_telepon: nomor_telepon,
      jenis_kelamin: jenis_kelamin,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Anggota berhasil di tambahkan",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.anggotaMasuk = async (req, res) => {
  const { nomor_induk_siswa, password } = req.body;
  try {
    const anggota = await Anggota.findOne({
      where: {
        nomor_induk_siswa: nomor_induk_siswa,
      },
    });
    if (!anggota) {
      return res.status(400).json({
        status: res.statusCode,
        msg: "Akun Tidak Terdaftar",
      });
    }

    if (anggota.password !== password) {
      return res.status(400).json({
        status: res.statusCode,
        msg: "Password yang anda masukkan salah",
      });
    }

    await Anggota.update(
      {
        terakhir_masuk: moment().add(7, "h").format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        where: {
          id: anggota.id,
        },
      }
    );

    const token = jwt.sign({ id: anggota.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(201).json({
      status: res.statusCode,
      msg: "Siswa berhasil login",
      token: token,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: message.error,
    });
  }
};

exports.panggilSemuaAnggota = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const sqlRow = `select count(anggota.id) from anggota where anggota.nomor_induk_siswa like '%2020%' or anggota.nama like '%2020%';`;
    const totalRows = await db.query(sqlRow, {
      type: QueryTypes.SELECT,
    });
    const totalPage = Math.ceil(totalRows[0].totalRows / limit);
    const sql = `select a.id, a.nomor_induk_siswa, a.foto, a.nama, k.kelas, a.jenis_kelamin, a.nomor_telepon, a.alamat from anggota as a
    join kelas as k on (a.id_kelas = k.id) where a.nomor_induk_siswa like '%${search}%' or a.nama like '%${search}%' order by a.nama asc limit ${limit} offset ${offset} `;
    const anggota = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Semua anggota Berhasil di panggil",
      data: anggota,
      page: page,
      limit: limit,
      totalRows: totalRows[0].totalRows,
      totalPage: totalPage,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilAnggotaById = async (req, res) => {
  try {
    const sql = `select a.id, a.nomor_induk_siswa, a.password, a.foto,a.nama, k.id as id_kelas, k.kelas, a.jenis_kelamin, a.nomor_telepon, a.alamat from anggota as a
    join kelas as k on (a.id_kelas = k.id) where a.id = ${req.params.id}; `;
    const anggota = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    console.log(anggota);
    res.status(200).json({
      status: res.statusCode,
      msg: "Semua anggota Berhasil di panggil",
      data: anggota[0],
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.hapusAnggotaById = async (req, res) => {
  try {
    await Anggota.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Anggota Berhasil di hapus",
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.updateAnggotaById = async (req, res) => {
  const {
    nama,
    id_kelas,
    nomor_induk_siswa,
    jenis_kelamin,
    password,
    nomor_telepon,
    alamat,
  } = req.body;

  console.log("file:", req.file);
  console.log("body:", req.body);

  try {
    const anggota = await Anggota.findByPk(req.params.id);
    let foto = anggota.foto;

    if (req.file) {
      hapusFoto(foto);
      foto =
        req.protocol +
        "://" +
        req.get("host") +
        "/uploads" +
        "/" +
        req.file.filename;
    }

    await Anggota.update(
      {
        nama: nama,
        nomor_induk_siswa: nomor_induk_siswa,
        id_kelas: id_kelas,
        jenis_kelamin: jenis_kelamin,
        foto: foto,
        password: password,
        nomor_telepon: nomor_telepon,
        alamat: alamat,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({
      status: res.statusCode,
      msg: "Anggota berhasil di update",
      data: foto,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilAnggotaTerakhirMasuk = async (req, res) => {
  try {
    const sql = `select a.id, a.nomor_induk_siswa, a.foto, a.nama, a.terakhir_masuk, k.kelas, a.jenis_kelamin, a.nomor_telepon, a.alamat from anggota as a
    join kelas as k on (a.id_kelas = k.id)
    ORDER BY terakhir_masuk DESC
    LIMIT 10 `;
    const anggota = await db.query(sql, {
      type: QueryTypes.SELECT,
    });

    res.status(200).json({
      status: res.statusCode,
      msg: "Anggota berhasil di panggil",
      data: anggota,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

//transaksi
exports.ajukanPeminjaman = async (req, res) => {
  const { id_anggota, id_buku } = req.body;
  try {
    const buku = await Buku.findAll({
      where: {
        id: id_buku,
      },
    });

    if (buku[0].stok <= 0) {
      return res.status(400).json({
        status: res.statusCode,
        msg: "buku tidak tersedia",
      });
    }

    await Peminjaman.create({
      id_anggota: id_anggota,
      id_buku: id_buku,
      tanggal_pesan: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    await Buku.update(
      {
        stok: buku[0].stok - 1,
      },
      {
        where: {
          id: id_buku,
        },
      }
    );
    res.status(201).json({
      status: res.statusCode,
      msg: "peminjaman berhasil di ajukan",
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.ajukanPengembalian = async (req, res) => {
  try {
    await Pengembalian.create(req.body);
    res.status(201).json({
      status: res.statusCode,
      msg: "pengembalian berhasil di ajukan",
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
//end transaksi

//buku siswa

exports.panggilBukuSaya = async (req, res) => {
  try {
    const sql = `select * from pengembalian as pgm
    join peminjaman as pjm on (pgm.id_peminjaman = pjm.id)
    join buku as b on (pjm.id_buku = b.id) where pjm.id_anggota = ${req.params.id} and pjm.status = "diterima" and pgm.status != "dikembalikan";`;
    const bukuSaya = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil memanggil buku saya",
      data: bukuSaya,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilPengembalianBukuSaya = async (req, res) => {
  try {
    const sql = `select * from pengembalian as pgm
    join peminjaman as pjm on (pgm.id_peminjaman = pjm.id)
    join buku as b on (pjm.id_buku = b.id) where pjm.id_anggota = ${req.params.id} and pgm.status = "menunggu";`;
    const bukuSaya = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil memanggil pengjuan pengembalian buku",
      data: bukuSaya,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilRiwayatBukuSaya = async (req, res) => {
  try {
    const sql = `select * from pengembalian as pgm
    join peminjaman as pjm on (pgm.id_peminjaman = pjm.id)
    join buku as b on (pjm.id_buku = b.id) where pjm.id_anggota = ${req.params.id} and pgm.status = "dikembalikan";`;
    const bukuSaya = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil memanggil buku saya",
      data: bukuSaya,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilPeminjamanBukuSaya = async (req, res) => {
  try {
    const sql = `select * from peminjaman as pjm
    join buku as b on (pjm.id_buku = b.id) where pjm.id_anggota = ${req.params.id} and pjm.status = "menunggu";`;
    const bukuSaya = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil memanggil buku saya",
      data: bukuSaya,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

//buku siswa end
