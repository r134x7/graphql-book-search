const express = require('express');
const path = require('path');
const { ApolloServer } = require ("apollo-server-express");

const db = require('./config/connection');
const { typeDefs, resolvers } = require("./schemas"); 
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware, // needed for running the JWT auth file
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start(); // await to start the server
  server.applyMiddleware({ app }); // apply the express middleware

  db.once('open', () => { // open the database connection to mongoose
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

startApolloServer(typeDefs, resolvers); // have to call the function to startApolloServer
