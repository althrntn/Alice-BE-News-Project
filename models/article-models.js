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
