import express from 'express';
import Follow from '../models/Follows.js';
const router = express.Router();
import { authenticateUser } from '../middleware/auth.js';
router.post('/:userId', authenticateUser, async (req, res) => {
    try {
      const followerId = req.user.id;
      const {userId} = req.params;

      console.log('followerId:', followerId);
      console.log('userId:', userId);

      if (followerId.toString() === userId) {
        return res.status(400).json({ message: "You can't follow yourself." });
      }
      
      const result = await Follow.create({ followerId, followingId: userId ,status: 'pending'});
      console.log('Follow.create result:', result);
      res.status(200).json({ message: 'Followed successfully.' });
      
    } catch (err) {
                console.error('Error in follow route:', err);
        if (err.code === 11000) {
          return res.status(400).json({ message: 'Already following.' });
        }
        res.status(500).json({ message: 'Server error.' });
      }
  });

router.delete('/:userId',authenticateUser, async (req, res) =>{
    try {
        const { userId } = req.params;
        const followerId = req.user.id;
    
        await Follow.findOneAndDelete({ followerId, followingId: userId });
        res.status(200).json({ message: 'Unfollowed successfully.' });
      } catch (err) {
        res.status(500).json({ message: 'Server error.' });
      }
})

router.get('/followers/:userId',authenticateUser,async(req,res)=>{
    try {
        const { userId } = req.params;
        const followers = await Follow.find({ followingId: userId }).populate('followerId', 'username');
        res.status(200).json(followers.map(f => f.followerId));
      } catch (err) {
        res.status(500).json({ message: 'Server error.' });
      }
})

router.get('/following/:userId',authenticateUser,async(req,res)=>{
    try {
        const { userId } = req.params;
        const following = await Follow.find({ followerId: userId }).populate('followingId', 'username');
        res.status(200).json(following.map(f => f.followingId));
      } catch (err) {
        res.status(500).json({ message: 'Server error.' });
      }
})

// Accept follow request
router.post('/accept/:followerId', authenticateUser, async (req, res) => {
    try {
      const followingId = req.user.id;
      const { followerId } = req.params;
  
      const follow = await Follow.findOneAndUpdate(
        { followerId, followingId, status: 'pending' },
        { status: 'accepted' },
        { new: true }
      );
  
      if (!follow) {
        return res.status(404).json({ message: 'Follow request not found' });
      }
  
      res.status(200).json({ message: 'Follow request accepted' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

// Reject follow request
router.post('/reject/:followerId', authenticateUser, async (req, res) => {
    try {
      const followingId = req.user.id;
      const { followerId } = req.params;
  
      const result = await Follow.findOneAndUpdate(
        { followerId, followingId, status: 'pending' },
        { status: 'rejected' },
        { new: true }
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Follow request not found' });
      }
  
      res.status(200).json({ message: 'Follow request rejected' });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/requests/pending', authenticateUser, async (req, res) => {
    try {
      const requests = await Follow.find({
        followingId: req.user.id,
        status: 'pending'
      });
  
      res.status(200).json(requests);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });



export default router;

