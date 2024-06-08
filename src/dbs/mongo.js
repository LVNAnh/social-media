const mongoose = require("mongoose");

class Mongo {
  constructor() {
    this._connect();
  }

  _connect() {
    const env = process.env.NODE_ENV;
    let URL = "";
    if (env === "dev") {
      URL = process.env.MONGO_URL_DEV;
    } else if (env === "qc") {
      URL = process.env.MONGO_URL_QC;
    } else {
      URL = process.env.MONGO_URL_PROD;
    }

    console.log("Connecting to MongoDB at:", URL);

    mongoose
      .connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.log("Database connection error:", err);
      });
  }
}

module.exports = new Mongo();
