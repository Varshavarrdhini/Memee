module.exports = /* GraphQL */ `
  type Meme {
    id: ID!
    title: String!
    caption: String!
    imageUrl: String!
    subject: String
    examDate: String
    visualPriority: String
    feedbackRating: Float
  }

  input MemeInput {
    text: String!
    subject: String
    examDate: String
    userId: String
  }

  type Feedback {
    memeId: ID!
    rating: Int!
    comment: String
  }

  type Query {
    getMeme(id: ID!): Meme
    getAllMemes(subject: String): [Meme!]!
    health: String
  }

  type Mutation {
    generateMeme(input: MemeInput!): Meme!
    submitFeedback(memeId: ID!, rating: Int!, comment: String): Feedback!
  }
`;
