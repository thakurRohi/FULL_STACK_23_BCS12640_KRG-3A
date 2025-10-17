import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,          // Appwrite user ID who performed the like
    required: true
  },
  targetType: {
    type: String,
    enum: ['post'],  // Restricts to only these two values
    required: true
  },
  targetId: {
    type: String,          // ID of the post or comment being liked
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index prevents duplicate bookmark
bookmarkSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;