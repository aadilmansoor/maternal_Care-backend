require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
require("./DataBase/connection");

const server = express();

// CORS middleware setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://maternal-care.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

server.use(cors(corsOptions));

server.use(express.json());
server.use(cookieParser());

// Serving static files
server.use("/serviceProviderImage", express.static("./serviceProviderImage"));
server.use("/upload_cirtificate", express.static("./upload_cirtificate"));
server.use("/webinarImage", express.static("./webinarImage"));
server.use("/blogImage", express.static("./blogImage"));

server.use(router);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

server.get("/", (req, res) => {
  res.status(200).json("Service started");
});
