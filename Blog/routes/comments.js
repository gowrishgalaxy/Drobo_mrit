const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Add a comment to a specific post (requires authentication)
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    // Validation
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create comment
    const comment = new Comment({
      content,
      author: req.userId,
      post: postId
    });

    await comment.save();
    await comment.populate('author', 'username email');

    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all comments for a post
router.get('/:postId/comments', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get comments
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Comments retrieved successfully',
      count: comments.length,
      comments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
