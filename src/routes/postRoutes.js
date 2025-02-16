const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const protect = require('../middlewares/authMiddleware');

// Create a new post
router.post('/post', protect, postController.createPost);

// Get all posts
router.get('/post', protect, postController.getAllPosts);

// Get a single post by ID 
router.get('/post/:id', protect, postController.getPostById);

// // Update a post by ID
router.put('/post/:id', protect, postController.updatePostById);

// // Delete a post by ID
router.delete('/post/:id', protect, postController.deletePostById);

module.exports = router;

