module.exports = mongoose => {
  const Question = mongoose.model(
    "question",
    mongoose.Schema(
      {
        questionId: {
          type: String,
          required: true,
          unique: true
        },
        questionTitle: {
          type: String,
          required: true,
          unique: true
        },
        questionDescription: {
          type: String,
          required: true
        },
        questionCategory: {
          type: Array,
          required: true
        },
        questionComplexity: {
          type: String,
          required: true
        },
        questionTags: {
          type: Array,
          required: false
        }
      },
      { timestamps: true }
    )
  );

  return Question;
};