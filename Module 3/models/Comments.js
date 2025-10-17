import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: {
      type: String,          // Stores Appwrite post document ID
      required: true,        // Must be provided
      index: true           // Creates database index for faster queries
    },
    userId: {
      type: String,          // Appwrite user ID who created comment
      required: true
    },
    userName: String,        // Cached user name to avoid Appwrite API calls
    userEmail: String,       // Cached email for display purposes
    content: {
      type: String,          // The actual comment text
      required: true,
      maxLength: 1000        // Limit comment length
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,  // MongoDB ObjectId for nested replies
      ref: 'Comment',                        // References another comment document
      default: null                          // null means top-level comment
    },
    likes: [{
      userId: String,                        // Appwrite user ID who liked
      createdAt: { type: Date, default: Date.now }  // When they liked it
    }],
    createdAt: {
      type: Date,
      default: Date.now      // Automatically set when document is created
    },
    updatedAt: {
      type: Date,
      default: Date.now      // Updated when comment is edited
    }
  });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;