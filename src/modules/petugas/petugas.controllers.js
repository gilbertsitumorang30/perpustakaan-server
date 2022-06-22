const Petugas = require("./petugas.model");
const Anggota = require("../anggota/anggota.model");
const Peminjaman = require("../peminjaman/peminjaman.model");
const Pengembalian = require("../pengembalian/pengembalian.model");
const moment = require("moment");
const Buku = require("../buku/buku.model");
const jwt = require("jsonwebtoken");

//Petugas

exports.petugasMasuk = async (req, res) => {
  const { nomor_induk_pegawai, password } = req.body;
  console.log(
    "nomor induk: ",
    nomor_induk_pegawai,
    "inilah password : ",
    password
  );
  try {
    const petugas = await Petugas.findOne({
      where: {
        nomor_induk_pegawai: nomor_induk_pegawai,
      },
    });

    if (!petugas) {
      return res.status(400).json({
        status: res.statusCode,
        msg: "Akun Tidak Terdaftar",
      });
    }
    if (petugas.password !== password) {
      return res.status(400).json({
        status: res.statusCode,
        msg: "Password yang anda masukkan salah",
      });
    }

    const token = jwt.sign({ id: petugas.id }, process.env.SECRET_KEY);

    res.status(201).json({
      status: res.statusCode,
      msg: "Berhasil login",
      token: token,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: message.error,
    });
  }
};

exports.panggilSemuaPetugas = async (req, res) => {
  try {
    const petugas = await Petugas.findAll({
      attributes: [
        "id",
        "nomor_induk_pegawai",
        "nama",
        "jenis_kelamin",
        "nomor_telepon",
        "alamat",
      ],
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Data petugas berhasil di panggil",
      data: petugas,
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

exports.panggilPetugasById = async (req, res) => {
  try {
    const petugas = await Petugas.findAll({
      attributes: [
        "id",
        "nomor_induk_pegawai",
        "nama",
        "jenis_kelamin",
        "nomor_telepon",
        "alamat",
      ],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      status: res.statusCode,
      msg: "Data petugas berhasil di panggil",
      data: petugas[0],
    });
  } catch (error) {
    res.status(400).json({
      msg: error.message,
    });
  }
};

exports.tambahPetugas = async (req, res) => {
  try {
    await Petugas.create(req.body);
    res.status(201).json({
      status: res.statusCode,
      msg: "Petugas berhasil ditambahkan",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.updatePetugasById = async (req, res) => {
  try {
    await Petugas.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({
      status: res.statusCode,
      msg: "Petugas berhasil di update",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.hapusPetugasById = async (req, res) => {
  try {
    await Petugas.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({
      status: res.statusCode,
      msg: "Petugas berhasil di hapus",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.panggilTotal = async (req, res) => {
  try {
    const totalAnggota = await Anggota.count();
    const totalBuku = await Buku.count();
    const totalPeminjaman = await Peminjaman.count();
    const totalPengembalian = await Pengembalian.count();

    res.status(200).json({
      status: res.statusCode,
      msg: "Total berhasil dipanggil",
      data: {
        totalAnggota: totalAnggota,
        totalBuku: totalBuku,
        totalPeminjaman: totalPeminjaman,
        totalPengembalian: totalPengembalian,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

//end petugas

//transaksi

exports.tambahPeminjaman = async (req, res) => {
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

    await Peminjaman.create({
      id_anggota: id_anggota,
      id_buku: id_buku,
      status: "diterima",
      tanggal_pinjam: moment().format("YYYY-MM-DD HH:mm:ss"),
      tanggal_harus_kembali: moment().add(7, "d").format("YYYY-MM-DD HH:mm:ss"),
    });

    res.status(201).json({
      status: res.statusCode,
      msg: "peminjaman berhasil di tambahkan",
      data: buku,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.konfirmasiPeminjaman = async (req, res) => {
  const { id_peminjaman, status } = req.body;

  try {
    const peminjaman = await Peminjaman.findAll({
      where: {
        id: id_peminjaman,
      },
    });
    const buku = await Buku.findAll({
      where: {
        id: peminjaman[0].id_buku,
      },
    });
    if (status === "diterima") {
      await Peminjaman.update(
        {
          status: status,
          tanggal_pinjam: moment().format("YYYY-MM-DD HH:mm:ss"),
          tanggal_harus_kembali: moment()
            .add(7, "d")
            .endOf("days")
            .format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          where: {
            id: id_peminjaman,
          },
        }
      );
    } else {
      await Peminjaman.update(
        {
          status: status,
        },
        {
          where: {
            id: id_peminjaman,
          },
        }
      );
      await Buku.update(
        {
          stok: buku[0].stok + 1,
        },
        {
          where: {
            id: peminjaman[0].id_buku,
          },
        }
      );
    }
    res.status(201).json({
      status: res.statusCode,
      msg: "peminjaman telah di konfirmasi",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.pengembalian = async (req, res) => {
  const { id_peminjaman, status, denda, terlambat } = req.body;
  try {
    const peminjaman = await Peminjaman.findAll({
      where: {
        id: id_peminjaman,
        id_petugas: 1,
      },
    });
    await Peminjaman.update(
      {
        status: "kembali",
      },
      {
        where: {
          id: id_peminjaman,
        },
      }
    );
    const buku = await Buku.findAll({
      where: {
        id: peminjaman[0].id_buku,
      },
    });
    await Buku.update(
      {
        stok: buku[0].stok + 1,
      },
      {
        where: {
          id: buku[0].id,
        },
      }
    );
    const pengembalian = await Pengembalian.create({
      id_peminjaman: id_peminjaman,
      status: status,
      denda: denda,
      terlambat: terlambat,
    });

    res.status(201).json({
      status: res.statusCode,
      msg: "pengembalian buku berhasil",
      data: pengembalian,
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.konfirmasiPengembalian = async (req, res) => {
  const { id_peminjaman, id_petugas, status } = req.body;
  const pengembalian = await Pengembalian.findAll({
    where: {
      id: req.params.id,
    },
  });
  const peminjaman = await Peminjaman.findAll({
    where: {
      id: id_peminjaman,
    },
  });
  const tanggal_harus_kembali = moment(
    peminjaman[0].tanggal_harus_kembali
  ).subtract(7, "h");
  const tanggal_kembali = moment(pengembalian[0].tanggal_kembali).subtract(
    7,
    "h"
  );
  try {
    if (status === "dikembalikan") {
      await Pengembalian.update(
        {
          id_peminjaman: id_peminjaman,
          id_petugas: id_petugas,
          status: status,
          tanggal_disetujui: moment().add(7, "h").format("YYYY-MM-DD HH:mm:ss"),
          denda: 0,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      if (tanggal_kembali > tanggal_harus_kembali) {
        const terlambat = tanggal_kembali
          .add(1, "days")
          .diff(tanggal_harus_kembali, "days");
        await Pengembalian.update(
          {
            denda: terlambat * 1000,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
      }
      const buku = await Buku.findAll({
        where: {
          id: peminjaman[0].id_buku,
        },
      });
      await Buku.update(
        {
          stok: buku[0].stok + 1,
        },
        {
          where: {
            id: peminjaman[0].id_buku,
          },
        }
      );
    } else {
      await Pengembalian.update(
        {
          id_petugas: id_petugas,
          status: status,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
    }
    res.status(201).json({
      status: res.statusCode,
      msg: "pengembalian telah di konfirmasi",
    });
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
//end transaksi
