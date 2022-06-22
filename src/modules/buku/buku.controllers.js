const Buku = require("./buku.model");
const db = require("../../config/database.connection");
const hapusFoto = require("../../utils/hapusFoto");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
exports.tambahBuku = async (req, res) => {
  console.log("req file:", req.file);
  console.log("req body:", req.body);

  if (!req.file) {
    return res.status(422).json({
      status: res.status,
      msg: "Gambar harus di upload",
    });
  }

  const {
    id_kategori,
    judul,
    penulis,
    penerbit,
    jumlah_halaman,
    bahasa,
    sinopsis,
    tahun_terbit,
    stok,
  } = req.body;

  const foto =
    req.protocol +
    "://" +
    req.get("host") +
    "/uploads" +
    "/" +
    req.file.filename;

  try {
    await Buku.create({
      judul: judul,
      id_kategori: id_kategori,
      foto: foto,
      penulis: penulis,
      penerbit: penerbit,
      jumlah_halaman: jumlah_halaman,
      bahasa: bahasa,
      sinopsis: sinopsis,
      tahun_terbit: tahun_terbit,
      stok: stok,
    });
    res.status(201).json({
      status: res.statusCode,
      msg: "Buku berhasil di tambahkan",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilSemuaBuku = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    const sqlRow = `select count(buku.id) as totalRows from buku
    join kategori on (buku.id_kategori = kategori.id) where kategori.kategori like '%${search}%' or buku.judul like '%${search}%';`;
    const totalRows = await db.query(sqlRow, {
      type: QueryTypes.SELECT,
    });

    const totalPage = Math.ceil(totalRows[0].totalRows / limit);
    const sql = `select b.id, b.judul, k.kategori, b.foto, b.penulis, b.penerbit, b.jumlah_halaman, b.bahasa, b.sinopsis, b.tahun_terbit from buku as b
    join kategori as k on(b.id_kategori = k.id) where b.judul like '%${search}%' or k.kategori like '%${search}%' order by b.id DESC limit ${limit} offset ${offset};`;
    const buku = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Semua buku berhasil di panggil",
      data: buku,
      page: page,
      limit: limit,
      totalRows: totalRows[0].totalRows,
      totalPage: totalPage,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilBukuById = async (req, res) => {
  try {
    const sql = `select b.id, b.stok, b.judul, k.id as id_kategori, k.kategori, b.foto, b.penulis, b.penerbit, b.jumlah_halaman, b.bahasa, b.sinopsis, b.tahun_terbit from buku as b
    join kategori as k on(b.id_kategori = k.id) where b.id = ${req.params.id};`;
    const buku = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Semua buku berhasil di panggil",
      data: buku[0],
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.updateBukuById = async (req, res) => {
  const {
    id_kategori,
    judul,
    penulis,
    penerbit,
    jumlah_halaman,
    bahasa,
    sinopsis,
    tahun_terbit,
    stok,
  } = req.body;

  try {
    const buku = await Buku.findByPk(req.params.id);
    let foto = buku.foto;
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

    await Buku.update(
      {
        id_kategori: id_kategori,
        judul: judul,
        foto: foto,
        penulis: penulis,
        penerbit: penerbit,
        jumlah_halaman: jumlah_halaman,
        bahasa: bahasa,
        sinopsis: sinopsis,
        tahun_terbit: tahun_terbit,
        stok: stok,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const bukuUpdate = await Buku.findByPk(req.params.id);

    res.status(201).json({
      status: res.statusCode,
      msg: "Buku berhasil di update",
      data: bukuUpdate,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.hapusBukuById = async (req, res) => {
  try {
    const buku = await Buku.findByPk(req.params.id);
    await Buku.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (buku) {
      hapusFoto(buku.foto);
    }
    res.status(201).json({
      status: res.statusCode,
      msg: "Buku berhasil di hapus",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.cariBukuBerdasarkanJudul = async (req, res) => {
  const judul = req.query.judul;
  try {
    const sql = `select b.id, b.judul, k.kategori, b.foto, b.penulis, b.penerbit, b.jumlah_halaman, b.bahasa, b.sinopsis, b.tahun_terbit from buku as b
    join kategori as k on(b.id_kategori = k.id) where b.judul LIKE "%${judul}%";`;
    const buku = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil mencari buku",
      data: buku,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.filterBukuBerdasarkanKategori = async (req, res) => {
  const kategori = req.query.kategori;
  try {
    const sql = `select b.id, b.judul, k.kategori, b.foto, b.penulis, b.penerbit, b.jumlah_halaman, b.bahasa, b.sinopsis, b.tahun_terbit from buku as b
    join kategori as k on(b.id_kategori = k.id) where k.kategori = "${kategori}";`;
    const buku = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil mencari buku",
      data: buku,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilSemuaBukuTerbaru = async (req, res) => {
  try {
    const sql = `select b.id, b.judul, k.kategori, b.foto, b.penulis, b.penerbit, b.jumlah_halaman, b.bahasa, b.sinopsis, b.tahun_terbit from buku as b
    join kategori as k on(b.id_kategori = k.id) order by b.createdAt desc;`;
    const buku = await db.query(sql, {
      type: QueryTypes.SELECT,
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Berhasil mencari buku",
      data: buku,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
