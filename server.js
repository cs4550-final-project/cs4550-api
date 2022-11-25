require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// require routes
const userRoutes = require("./app/routes/user_routes");
// require auth
const auth = require("./lib/auth");
// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require("./config/db");

// establish mongoDB connection
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(db).then(() => {
  console.log("database connected!");
});

const app = express();

// define port for API to run on
const port = process.env.PORT || 3000;

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(bodyParser.json());
// register passport authentication middleware
app.use(auth);

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const auth = req.headers.authorization;
    // if we find the Rails pattern in the header, replace it with the Express
    // one before `passport` gets a look at the headers
    req.headers.authorization = auth.replace("Token token=", "Bearer ");
  }
  next();
});
app.use(userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
