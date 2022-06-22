const express = require("express");
const kategoriControllers = require("./kategori.controllers");

const routes = express.Router();

routes.get("/", kategoriControllers.panggilSemuaKategori);

module.exports = routes;
