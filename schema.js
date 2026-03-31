const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Meme {
    id: ID!
    caption: String
    imageUrl: String
    subject: String
    examDate: String
    feedbackRating: Int
  }

  input MemeInput {
    text: String!
    subject: String
    examDate: String
  }

  type Feedback {
    memeId: ID!
    rating: Int
    comment: String
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    subject: String
  }

  input EventInput {
    title: String!
    date: String!
    subject: String
  }

  type Query {
    getMeme(id: ID!): Meme
    getAllMemes(subject: String): [Meme]
  }

  type Mutation {
    generateMeme(input: MemeInput!): Meme
    submitFeedback(memeId: ID!, rating: Int, comment: String): Feedback
    addEvent(eventInput: EventInput!): Event
  }
`;

module.exports = typeDefs;