const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((res) => {
    return res.rows;
  });
};
exports.fetchArticleById = () => {};
