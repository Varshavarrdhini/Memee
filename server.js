// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema');      // your schema file
const resolvers = require('./resolvers');  // the file we created
const BrainService = require('./services/brainService');

const app = express();

// ✅ Enable CORS
app.use(cors());
app.use(express.json()); // for JSON parsing

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 5000}${server.graphqlPath}`);
  });

  // Start memory-mapped reminder scheduler
  BrainService.startReminderScheduler();
}

startServer();