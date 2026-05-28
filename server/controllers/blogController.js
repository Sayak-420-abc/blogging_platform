const Blog = require("../models/Blog");

// GET all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

// GET single post
const getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

// CREATE post
const createPost = async (req, res) => {
  try {
    const { title, summary, content, author, image } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({
        message: "Title, summary and content are required",
      });
    }

    const newPost = await Blog.create({
      title,
      summary,
      content,
      author,
      image,
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// UPDATE post
const updatePost = async (req, res) => {
  try {
    const updatedPost = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    });
  }
};

// DELETE post
const deletePost = async (req, res) => {
  try {
    const deletedPost = await Blog.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
