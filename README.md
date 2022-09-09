# Northcoders News API

A hosted version of the API can be found here: https://alice-nc-news.herokuapp.com/api

This project is a RESTful API for accessing news articles and associated comments. Various HTTP requests can be performed to endpoints for articles, comments and users.

# Working with the API

This project can be forked and cloned from GitHub here: https://github.com/althrntn/Alice-BE-News-Project/tree/main

Once cloned, several dependencies are needed to run the project: please install dotenv, express and postgres (pg). For testing purposes, jest, jest-sorted, jest-extended and supertest are also required. These packages are included in the package.json so can be installed by running 'npm install'.

The API connects to two local databases - the development database and the testing database. Details of these can be found in the setup.sql file. Run this file with 'npm run setup-dbs' to create the databases. The run-seed.js file in the db/seeds directory can then be used to seed the development database when run.

The API has been set up with a full testing suite found in the **tests** directory. These tests can be run using 'npm test'. There is no need to seed the databases before running tests as the app.test.js file will re-seed the test databse prior to each test and close the database connection once testing is complete.

To run the API locally, use the 'npm start' script. The server will default to listening on port 9090.

# Database connection setup

To connect to the databases in the db folder of this project, you will need to create two .env files to direct connections to the correct environment variables. For testing, create a .env.test file to set PGDATABASE=nc_news_test. For development, create an .env.development file setting PGDATABASE=nc_news. Both files should be included in the .gitignore.

# Minimum requirements

Node.js v12 or later.
Postgres v8.2 or later.
