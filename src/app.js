require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("./dbs/mongo");

app.use("/api/v1", require("./routers"));

module.exports = app;
