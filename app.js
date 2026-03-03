const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema, //file path to the schema
    rootValue: graphqlResolvers, //file path to the resolvers
    graphiql: true,
  }),
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@nodetutorial.wj2c2jy.mongodb.net/${process.env.MONGO_DB}?appName=nodeTutorial`,
  )
  .then(() => {
    app.listen(3005, () => {
      console.log("Server is running on port 3005");
    });
  })
  .catch((err) => {
    console.log(err);
  });
