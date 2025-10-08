import express from 'express';
import Bookmark from '../models/Bookmarks.js';
import { databases } from '../config/appwrite.js';
import { authenticateUser } from '../middleware/auth.js';
const router = express.Router();

// Toggle Bookmark
router.post('/toggleBookmark', authenticateUser, async (req, res) => {
    try {
      const { targetType, targetId } = req.body;
      const userId = req.user.id;
  
      const existingBookmark = await Bookmark.findOne({ userId, targetType, targetId });
      let action;
      if (existingBookmark) {
        await existingBookmark.deleteOne();
        if (targetType === 'post') {
          const post = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            targetId
          );
          const updatedBookmarks = (post.Bookmark || []).filter(id => id !== userId);
          await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            targetId,
            { Bookmark: updatedBookmarks }
          );
        }
        action = 'removed';
      } 
      
      else {
        await Bookmark.create({ userId, targetType, targetId });
        if (targetType === 'post') {
          const post = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            targetId
          );
          const updatedBookmarks = [...(post.Bookmark || []), userId];
          await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            targetId,
            { Bookmark: updatedBookmarks }
          );
        }
        action = 'added';
      }
  
      res.json({ targetType, targetId, userId, action });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

router.get('/bookmarkStatus', authenticateUser, async (req, res) => {
    try {
      const { targetType, targetId } = req.query;
      const userId = req.user.id;
      if (!targetType || !targetId) {
        return res.status(400).json({ error: 'targetType and targetId are required' });
      }
      const existingBookmark = await Bookmark.findOne({ userId, targetType, targetId });
      res.json({ Bookmark: !!existingBookmark });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/user/:userId', async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    try {
      const Bookmarks = await Bookmark.find({ userId: req.params.userId,targetType: 'post'})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));
      const total = await Bookmark.countDocuments({ userId: req.params.userId });
      res.json({ Bookmarks, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a bookmark (and update post's Bookmark array)
  router.delete('/:id', authenticateUser, async (req, res) => {
    try {
      const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!bookmark) return res.status(404).json({ error: 'Not found or unauthorized' });
              // Also update the post's Bookmark array if targetType is 'post'
              if (bookmark.targetType === 'post') {
                const post = await databases.getDocument(
                    process.env.APPWRITE_DATABASE_ID,
                    process.env.APPWRITE_COLLECTION_ID,
                    bookmark.targetId
                );
                const updatedBookmarks = (post.Bookmark || []).filter(id => id !== req.user.id);
                await databases.updateDocument(
                    process.env.APPWRITE_DATABASE_ID,
                    process.env.APPWRITE_COLLECTION_ID,
                    bookmark.targetId,
                    { Bookmark: updatedBookmarks }
                );
            }
      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  export default router;