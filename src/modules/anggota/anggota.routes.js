const express = require("express");
const anggotaControllers = require("./anggota.controllers");
const multerImageUpload = require("../../config/middleware.upload");
const userVerification = require("../../services/user.auth");

const routes = express.Router();

routes.get("/", anggotaControllers.panggilSemuaAnggota);
routes.get("/terakhir-masuk", anggotaControllers.panggilAnggotaTerakhirMasuk);
routes.get("/:id", anggotaControllers.panggilAnggotaById);

routes.post(
  "/tambah",
  multerImageUpload.single("foto"),
  anggotaControllers.tambahAnggota
);
routes.post("/masuk", anggotaControllers.anggotaMasuk);
routes.put(
  "/:id",
  multerImageUpload.single("foto"),
  anggotaControllers.updateAnggotaById
);

routes.delete("/:id", anggotaControllers.hapusAnggotaById);

//transaksi
routes.post("/pinjam", userVerification, anggotaControllers.ajukanPeminjaman);
routes.post(
  "/pengembalian",
  userVerification,
  anggotaControllers.ajukanPengembalian
);
//end tranasaksi

//buku siwa
routes.get("/buku/saya/:id", anggotaControllers.panggilBukuSaya);
routes.get("/riwayat/buku/:id", anggotaControllers.panggilRiwayatBukuSaya);
routes.get("/pinjam/buku/:id", anggotaControllers.panggilPeminjamanBukuSaya);
routes.get("/kembali/buku/:id", anggotaControllers.panggilPengembalianBukuSaya);

module.exports = routes;
