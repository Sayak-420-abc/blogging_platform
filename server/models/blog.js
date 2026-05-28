const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      maxlength: [500, "Summary cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
