const express = require("express");
const pengembalianControllers = require("./pengembalian.controllers");

const routes = express.Router();

routes.get("/riwayat", pengembalianControllers.panggilSemuaPengembalian);
routes.get("/:id", pengembalianControllers.panggilPengembalianById);

module.exports = routes;
