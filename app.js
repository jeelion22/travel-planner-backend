const express = require("express");

const userRouter = require("./routes/userRoutes");

const cors = require("cors");

const app = express();

const cookieParser = require("cookie-parser");

const morgan = require("morgan");
const tripRouter = require("./routes/tripRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.head("/api", (req, res) => {
  res.send("Welcome to the Travel Planner API Endpoints!");
});

app.use("/api/users", userRouter, tripRouter);

module.exports = app;

module.exports = app;
