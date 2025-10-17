import mongoose from 'mongoose';

const FollowSchema = new mongoose.Schema({
    followerId: { type:String, required: true },
    followingId: { type:String, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
    createdAt: { type: Date, default: Date.now }
})

// Prevent duplicate follows
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
const Follow = mongoose.model('Follow', FollowSchema);
export default Follow;