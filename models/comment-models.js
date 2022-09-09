const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((results) => {
      return results.rows[0];
    });
};

exports.updateCommentVotes = (comment_id, newVotes) => {
  return db
    .query("SELECT votes FROM comments WHERE comment_id = $1", [comment_id])
    .then((result) => {
      if (result.rows[0]) {
        const votes = result.rows[0].votes;
        const updatedVotes = votes + newVotes;
        return updatedVotes;
      } else {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    })
    .then((updatedVotes) => {
      return db.query(
        "UPDATE comments SET votes = $2 WHERE comment_id = $1 RETURNING *;",
        [comment_id, updatedVotes]
      );
    })
    .then((result) => {
      return result.rows[0];
    });
};
