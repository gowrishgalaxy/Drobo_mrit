const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create a blog post (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Create post
    const post = new Post({
      title,
      content,
      author: req.userId
    });

    await post.save();
    await post.populate('author', 'username email');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch all posts with their comments
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username email'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      message: 'Posts retrieved successfully',
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch a single post with comments
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username email'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({
      message: 'Post retrieved successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
