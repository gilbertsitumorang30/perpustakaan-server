const Kategori = require("./kategori.model");

exports.panggilSemuaKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findAll();
    res.status(200).json({
      status: res.statusCode,
      msg: "Semua kategori berhasil di panggil",
      data: kategori,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
