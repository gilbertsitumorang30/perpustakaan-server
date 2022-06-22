const express = require("express");
const multerImageUpload = require("../../config/middleware.upload");
const bukuControllers = require("./buku.controllers");
const userVerification = require("../../services/user.auth");

const routes = express.Router();

routes.get("/", bukuControllers.panggilSemuaBuku);
routes.get("/cari", bukuControllers.cariBukuBerdasarkanJudul);
routes.get("/filter", bukuControllers.filterBukuBerdasarkanKategori);
routes.get("/terbaru", bukuControllers.panggilSemuaBukuTerbaru);
routes.get("/:id", bukuControllers.panggilBukuById);

routes.put(
  "/:id",
  multerImageUpload.single("foto"),
  bukuControllers.updateBukuById
);

routes.delete("/:id", bukuControllers.hapusBukuById);

routes.post(
  "/tambah",
  multerImageUpload.single("foto"),
  bukuControllers.tambahBuku
);

//pencarian

module.exports = routes;
