const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((article) => {
      if (article.rows.length === 1) {
        return article.rows[0];
      } else {
        return Promise.reject({ status: 404, msg: "article not found" });
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
      return results.rows[0];
    });
};
