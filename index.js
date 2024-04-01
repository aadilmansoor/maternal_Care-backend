require("dotenv").config();

const express = require("express");
const cookieParser = require('cookie-parser');

require("./DataBase/connection");

const cors = require("cors");

const server = express();
const router = require("./routes/routes");

server.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

server.use(express.json());

server.options("*", cors());
server.use(cookieParser())
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

server.use(router);

const port = 4000 || process.env.port;

server.listen(port, () => {
  console.log(`server start at ${port}`);
});

server.get("/", (req, res) => {
  res.status(200).json("service started");
});
