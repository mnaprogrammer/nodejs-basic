const Post = require("../models/postModel");

const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user = req.user
    const newPost = new Post({ title, description, user});
    await newPost.save()
    res.status(201).send({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.size) || 10;
    const totalPosts = await Post.find().countDocuments({user: req.user._id});
    const posts = (await Post.find({user: req.user._id }).skip((limit * page) - limit).limit(limit).populate("user", "name email"))
    res.status(200).send({ posts: posts, totalPosts });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

// This function is an asynchronous function that takes in a request and response object as parameters
const getPostById = async (req, res) => {
  // Try to find the post by its id
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    // If the post is found, send a status of 200 and the post
    res.status(200).send({ status: true, message: post });
  } catch (error) {
    // If an error occurs, send a status of 500 and the error message
    res.status(500).send({ status: false, message: error.message });
  }
}

const updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
    res.status(200).send({ status: true, message: updatedPost });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await postModel.findByIdAndDelete(postId);
    res.status(200).send({ status: true, message: deletedPost });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
}

module.exports = { 
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById
}
