const Kelas = require("./kelas.model");

exports.panggilSemuaKelas = async (req, res) => {
  try {
    const kelas = await Kelas.findAll();
    res.status(200).json({
      status: res.statusCode,
      msg: "Kelas berhasil di panggil",
      data: kelas,
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};

exports.tambahKelas = async (req, res) => {
  try {
    await Kelas.create(req.body);
    res.status(200).json({
      status: res.statusCode,
      msg: "Kelas berhasil di tambahkan",
    });
  } catch (error) {
    res.status(404).json({
      status: res.statusCode,
      msg: error.message,
    });
  }
};
