module.exports = mongoose => {
    const Counter = mongoose.model(
      "counter",
      mongoose.Schema(
        {
          id: {
            type: String,
            required: true,
            unique: true
          },
          seq: {
            type: Number,
            required: true
          }
        },
        { timestamps: true }
      )
    );
  
    return Counter;
  };