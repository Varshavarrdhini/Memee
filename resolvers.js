const BrainService = require('./services/brainService');

const resolvers = {
  Query: {
    getMeme: (_, { id }) => BrainService.getMeme(id),
    getAllMemes: (_, { subject }) => BrainService.getAllMemes(subject)
  },

  Mutation: {
    generateMeme: async (_, { input }) => {
      const { text, subject, examDate } = input;

      const { caption, imageUrl } = await BrainService.generateMemeFromText(text, subject, examDate);

      const meme = {
        caption,
        imageUrl,
        subject,
        examDate,
        feedbackRating: 0
      };

      return BrainService.storeMeme(meme);
    },

    submitFeedback: (_, { memeId, rating, comment }) => {
      return BrainService.submitFeedback(memeId, rating, comment);
    },

    addEvent: (_, { eventInput }) => {
      // New mutation to add memory-mapped events
      return BrainService.addEvent(eventInput);
    }
  }
};

module.exports = resolvers;