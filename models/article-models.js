const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.article_id, articles.author, title, topic, articles.body, articles.created_at, articles.votes FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1",
      [article_id]
    )
    .then((results) => {
      if (results.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        let count = 0;
        const article = results.rows[0];
        article["comment_count"] = count;
        if (results.rows.length > 1) {
          article.comment_count = results.rows.length;
          return article;
        } else {
          return article;
        }
      }
    });
};
exports.updateArticleVotes = (article_id, voteUpdate, comment_count) => {
  return db
    .query(
      "UPDATE articles SET votes = $2 WHERE article_id = $1 RETURNING *;",
      [article_id, voteUpdate]
    )
    .then((results) => {
      const article = results.rows[0];
      article.comment_count = comment_count;
      return article;
    });
};
