const express = require("express");
const app = express();

const petugasRoutes = require("./petugas/petugas.routes");
const anggotaRoutes = require("./anggota/anggota.routes");
const kelasRoutes = require("./kelas/kelas.routes");
const kategoriRoutes = require("./kategori/kategori.routes");
const bukuRoutes = require("./buku/buku.routes");
const peminjamanRoutes = require("./peminjaman/peminjaman.routes");
const pengembalianRoutes = require("./pengembalian/pengembalian.routes");

app.use("/petugas", petugasRoutes);
app.use("/anggota", anggotaRoutes);
app.use("/buku", bukuRoutes);
app.use("/kelas", kelasRoutes);
app.use("/kategori", kategoriRoutes);
app.use("/peminjaman", peminjamanRoutes);
app.use("/pengembalian", pengembalianRoutes);

module.exports = app;
