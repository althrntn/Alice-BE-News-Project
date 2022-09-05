const express = require("express");
const { getTopics } = require("./controllers/topic-controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id");
app.get("*", function (req, res) {
  res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "internal server error" });
});

module.exports = { app };
