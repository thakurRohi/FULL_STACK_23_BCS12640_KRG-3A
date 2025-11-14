// src/features/comments/commentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set your base API URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || '/vercel-api/api';

// Fetch comments for a post
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ postId, page = 1, limit = 20 }) => {
    const res = await axios.get(
      `${API_BASE_URL}/comments/post/${postId}?page=${page}&limit=${limit}`
    );
    return res.data;
  }
);

// Add a new comment
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content, parentCommentId, userId, sessionId }) => {
    const res = await axios.post(
      `${API_BASE_URL}/comments`,
      { postId, content, parentCommentId },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-appwrite-user-id': userId,
          'x-appwrite-session-id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Update a comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content, userId, sessionId }) => {
    const res = await axios.put(
      `${API_BASE_URL}/comments/${commentId}`,
      { content },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-appwrite-user-id': userId,
          'x-appwrite-session-id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ commentId, userId, sessionId }) => {
    const res = await axios.delete(
      `${API_BASE_URL}/comments/${commentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-appwrite-user-id': userId,
          'x-appwrite-session-id': sessionId,
        },
      }
    );
    return res.data;
  }
);

const initialState=
 { 
    items: [],
     status: 'idle', 
     error: null 

 }

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
 
    reducers: {
      resetComments: (state) => {
        state.items = [];
        state.status = 'loading';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchComments.pending, (state) => {
          state.status = 'loading';
          state.error = null;
          state.items = [];
        })
        .addCase(fetchComments.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload.comments;
        })
        .addCase(fetchComments.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
        // handle other thunks similarly
    },
  });
  export default commentsSlice.reducer;
  export const { resetComments } = commentsSlice.actions;
  
// ... update and delete thunks similarly
