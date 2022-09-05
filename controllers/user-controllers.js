const { fetchUsers } = require("../models/user-models");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    console.log(users);
    res.status(200).send(users);
  });
};
