const { removeComment } = require("../models/comment-models");

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeComment(comment_id)
    .then((deletedComment) => {
      if (
        deletedComment &&
        deletedComment.comment_id === parseInt(comment_id)
      ) {
        res.status(204).send(null);
      } else {
        res.status(404).send({ msg: "comment not found" });
      }
    })
    .catch(next);
};
