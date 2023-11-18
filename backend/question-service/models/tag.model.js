module.exports = mongoose => {
    const Tag = mongoose.model(
      "tag",
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
  
    return Tag;
  };