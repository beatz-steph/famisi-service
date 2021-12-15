require("dotenv").config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var morgan = require("morgan");
var config = require("./src/config/database");
var database = require("./src/config/database");
var routes = require("./src/routes");
var port = process.env.PORT || 8000;
var parseToken = require("./src/middleware/parsetoken.middleware");

database.connect();

app.set("superSecret", config.secret); // req config.secret or process.env.APP_SECRET where app is not present

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}
app.use(parseToken);
routes(express, app);

app.listen(port, function () {
  console.log("JWT API at http://localhost:" + port);
});

module.exports = app;
