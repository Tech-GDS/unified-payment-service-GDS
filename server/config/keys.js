require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  module.exports = require("./keys_prod");
} else if (process.env.NODE_ENV === "dev") {
  module.exports = require("./keys_dev");
}

// module.exports = require('./keys_dev');
