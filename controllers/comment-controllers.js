const { removeComment } = require("../models/comment-models");

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeComment(comment_id)
    .then((deletedComment) => {
      if (
        deletedComment &&
        deletedComment.comment_id === parseInt(comment_id)
      ) {
        res.sendStatus(204);
      } else {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    })
    .catch(next);
};
