const express = require("express");

const apiRouter = require("./routers/api-router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.get("*", function (req, res) {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  const badReqCodes = ["22P02", "23502", "42703", "42601"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  const notFoundCodes = ["23503"];
  if (notFoundCodes.includes(err.code)) {
    const errArray = err.detail.split(" ");
    const key = errArray[errArray.length - 1].slice(1, -3);
    res.status(404).send({ msg: `${key} not found` });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = { app };
