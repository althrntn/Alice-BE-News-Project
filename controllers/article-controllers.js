const {
  fetchArticleById,
  updateArticleVotes,
  fetchAllArticles,
  fetchCommentsForArticle,
} = require("../models/article-models");
const { fetchTopics } = require("../models/topic-models");

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};
exports.patchArticleVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  let voteUpdate = req.body.inc_votes;
  fetchArticleById(article_id)
    .then((result) => {
      const currentVotes = result.votes;
      voteUpdate += currentVotes;
      return updateArticleVotes(article_id, voteUpdate);
    })
    .then((result) => {
      return fetchArticleById(article_id);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getArticles = (req, res, next) => {
  const topic = req.query.topic;
  if (topic) {
    fetchTopics()
      .then((results) => {
        const topicCheck = results.filter((topicFound) => {
          return topicFound.slug === topic;
        });
        if (topicCheck.length > 0) {
          return fetchAllArticles(topic);
        } else {
          return Promise.reject({ status: 404, msg: "topic not found" });
        }
      })
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    fetchAllArticles()
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  }
};

exports.getCommentsForArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then((results) => {
      if (parseInt(results.comment_count) >= 1) {
        return fetchCommentsForArticle(article_id);
      } else {
        res.status(200).send({ comments: [] });
      }
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
