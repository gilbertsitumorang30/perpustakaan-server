const path = require("path");
const fs = require("fs");

const hapusFoto = (filePath) => {
  const imageName = filePath.substring(filePath.lastIndexOf("/") + 1);
  filePath = path.join(__dirname, "../../public/uploads", imageName);
  fs.unlink(filePath, (err) => {
    console.log("ini err : ", err);
  });
};

module.exports = hapusFoto;
