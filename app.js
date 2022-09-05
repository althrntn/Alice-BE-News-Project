const express = require("express");
const { getTopics } = require("./controllers/topic-controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("*", function (req, res) {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = { app };
