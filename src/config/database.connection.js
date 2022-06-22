const { Sequelize } = require("sequelize");

const db = new Sequelize("database_perpustakaan", "root", "root12345", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
