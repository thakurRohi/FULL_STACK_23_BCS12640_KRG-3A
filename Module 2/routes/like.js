import express from 'express';
import Like from '../models/Likes.js';
import Comment from '../models/Comments.js';
import { databases } from '../config/appwrite.js';
import { authenticateUser } from '../middleware/auth.js';
const router = express.Router();

// Toggle like
router.post('/toggle', authenticateUser, async (req, res) => {
  try {
    const { targetType, targetId } = req.body;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ userId, targetType, targetId });
    let action;
    if (existingLike) {
      await existingLike.deleteOne();
      if (targetType === 'comment') {
        await Comment.findByIdAndUpdate(targetId, { $pull: { likes: { userId } } });
      } else if (targetType === 'post') {
        const post = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          targetId
        );
        const updatedLikes = (post.likes || []).filter(id => id !== userId);
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          targetId,
          { likes: updatedLikes }
        );
      }
      action = 'removed';
    } else {
      await Like.create({ userId, targetType, targetId });
      if (targetType === 'comment') {
        await Comment.findByIdAndUpdate(targetId, { $push: { likes: { userId, createdAt: new Date() } } });
      } else if (targetType === 'post') {
        const post = await databases.getDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          targetId
        );
        const updatedLikes = [...(post.likes || []), userId];
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          targetId,
          { likes: updatedLikes }
        );
      }
      action = 'added';
    }

    res.json({ targetType, targetId, userId, action });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get like count for a target
router.get('/count', async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) {
      return res.status(400).json({ error: 'targetType and targetId are required' });
    }
    const count = await Like.countDocuments({ targetType, targetId });
    res.json({ count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users who liked a target
router.get('/users', async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    if (!targetType || !targetId) {
      return res.status(400).json({ error: 'targetType and targetId are required' });
    }
    const likes = await Like.find({ targetType, targetId }, 'userId');
    const userIds = likes.map(like => like.userId);
    res.json({ userIds });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Check if current user liked a target
router.get('/status', authenticateUser, async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    const userId = req.user.id;
    if (!targetType || !targetId) {
      return res.status(400).json({ error: 'targetType and targetId are required' });
    }
    const existingLike = await Like.findOne({ userId, targetType, targetId });
    res.json({ liked: !!existingLike });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
