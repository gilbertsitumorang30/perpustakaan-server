const express = require("express");
const kelasControllers = require("./kelas.controllers");

const routes = express.Router();

routes.get("/", kelasControllers.panggilSemuaKelas);

routes.post("/tambah", kelasControllers.tambahKelas);

module.exports = routes;
