const { fetchArticleById } = require("../models/topic-models");
const { fetchTopics } = require("../models/topic-models");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch(next);
};
exports.getArticleById = (req, res, next) => {
  fetchArticleById();
};
