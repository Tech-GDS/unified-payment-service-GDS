const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// to enable CORS
app.use(cors());

// load environment variable
require("dotenv").config();

// Import DB keys from config
const db = require("./config/keys").MONGO_URI;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// importing routes in the app
require("./routes/app.routes")(app);

// handles 404 if url is incorrect or method not allowed, declare it after using routes
app.use(function (request, response, next) {
  return response
    .status(404)
    .send({ message: request.url + " not found or method not allowed" });
});

// Connect to MongoDB via mongoose ODM
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    logger.error(
      // logs error with complete stack trace
      `${err.statusCode} - ${err}`
    );
  });

// To define port for the Express server
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
