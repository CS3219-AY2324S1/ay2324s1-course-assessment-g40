module.exports = mongoose => {
    const Category = mongoose.model(
      "category",
      mongoose.Schema(
        {
          name: {
            type: String,
            required: true,
            unique: true
          }
        },
        { timestamps: true }
      )
    );
  
    return Category;
};