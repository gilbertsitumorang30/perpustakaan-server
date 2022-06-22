const express = require("express");
const petugasControllers = require("./petugas.controllers");
const userVerification = require("../../services/user.auth");

const routes = express.Router();

//petugas
routes.get("/", petugasControllers.panggilSemuaPetugas);
routes.get("/total", petugasControllers.panggilTotal);
routes.get("/:id", petugasControllers.panggilPetugasById);
// routes.put("/:id", petugasControllers.updatePetugasById);
routes.delete("/:id", userVerification, petugasControllers.hapusPetugasById);
routes.post("/masuk", petugasControllers.petugasMasuk);
routes.post(
  "/tambah/petugas",
  userVerification,
  petugasControllers.tambahPetugas
);
//end petugas

//transaksi
routes.post("/tambah-peminjaman", petugasControllers.tambahPeminjaman);
routes.post("/kembalikan-buku", petugasControllers.pengembalian);
routes.put("/konfirmasi-peminjaman", petugasControllers.konfirmasiPeminjaman);
routes.put(
  "/konfirmasi/pengembalian/:id",
  userVerification,
  petugasControllers.konfirmasiPengembalian
);
//end transaksi

module.exports = routes;
