const {
  fetchArticleById,
  updateArticleVotes,
  fetchAllArticles,
  fetchCommentsForArticle,
  createNewComment,
  createNewArticle,
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
  const { topic, sort_by, order } = req.query;
  if (topic) {
    fetchTopics()
      .then((results) => {
        const topicCheck = results.filter((topicFound) => {
          return topicFound.slug === topic;
        });
        if (topicCheck.length > 0) {
          return fetchAllArticles(sort_by, order, topic);
        } else {
          return Promise.reject({ status: 404, msg: "topic not found" });
        }
      })
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
  } else {
    fetchAllArticles(sort_by, order)
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
exports.PostNewComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const newComment = req.body;
  createNewComment(article_id, newComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
exports.postNewArticle = (req, res, next) => {
  const newArticle = req.body;

  createNewArticle(newArticle)
    .then((newArticle_id) => {
      return fetchArticleById(newArticle_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
