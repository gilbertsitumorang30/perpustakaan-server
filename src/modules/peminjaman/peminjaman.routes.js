const express = require("express");
const petugasControllers = require("./peminjaman.controllers");

const routes = express.Router();

routes.get("/", petugasControllers.panggilSemuaPeminjaman);
routes.get("/pemesanan", petugasControllers.panggilSemuaPesanan);
routes.get("/riwayat", petugasControllers.panggilRiwayatPeminjaman);
routes.get("/:id", petugasControllers.panggilPeminjamanById);

module.exports = routes;
