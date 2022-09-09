const { fetchUsers, fetchUserById } = require("../models/user-models");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

exports.getUserById = (req, res, next) => {
  const username = req.params.username;
  fetchUserById(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
