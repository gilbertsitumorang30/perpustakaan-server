const jwt = require("jsonwebtoken");

const userVerification = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      status: res.statusCode,
      msg: "Akses di tolak",
    });
  }

  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verify;
    next();
  } catch (error) {
    res.status(400).json({
      status: res.statusCode,
      msg: "Token Tidak Valid",
    });
  }
};

module.exports = userVerification;
