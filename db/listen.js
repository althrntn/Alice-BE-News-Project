const app = require("../app");

const { application } = require("express");

const { PORT = 9090 } = process.env;
application.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`listening on ${PORT}...`);
});
