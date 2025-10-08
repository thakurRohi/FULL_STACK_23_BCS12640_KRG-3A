import express from 'express';
import Comment from '../models/Comments.js';
import { authenticateUser } from '../middleware/auth.js';
const router = express.Router();

// Create comment
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const comment = await Comment.create({
      postId,
      userId: req.user.id,
      userName: req.user.name,
      
      userEmail: req.user.email,
      content,
      parentCommentId
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const comments = await Comment.find({ postId: req.params.postId, parentCommentId: null })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Comment.countDocuments({ postId: req.params.postId, parentCommentId: null });
    res.json({ comments, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update comment
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { content: req.body.content, updatedAt: Date.now() },
      { new: true }
    );
    if (!comment) return res.status(404).json({ error: 'Not found or unauthorized' });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete comment
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!comment) return res.status(404).json({ error: 'Not found or unauthorized' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
