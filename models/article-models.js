const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        const article = results.rows[0];
        return article;
      }
    });
};
exports.updateArticleVotes = (article_id, voteUpdate) => {
  return db
    .query(
      "UPDATE articles SET votes = $2 WHERE article_id = $1 RETURNING *;",
      [article_id, voteUpdate]
    )
    .then((results) => {
      const article = results.rows[0];
      return article;
    });
};
exports.fetchAllArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id;"
    )
    .then((results) => {
      const noBodyResults = results.rows.map((result) => {
        delete result.body;
        return result;
      });
      return noBodyResults;
    });
};
