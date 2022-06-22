const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./src/config/database.connection");
const allRoutes = require("./src/modules");

//cors options
const corsOptions = {
  //To allow requests from client
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1",
    "https://perpustakaan-web.vercel.app",
  ],
  credentials: true,
  exposedHeaders: ["set-cookie"],
};

const app = express();

db.authenticate()
  .then(() => {
    console.log("berhasil terhubung kedatabase");
  })
  .catch((error) => {
    console.log("gagal terhubung ke database :", error);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "public")));
app.use("/api/v1", allRoutes);

app.listen(3031, () => {
  console.log("server berjalan...");
});
