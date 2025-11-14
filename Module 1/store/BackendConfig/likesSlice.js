import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set your base API URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || '/vercel-api/api';


// Fetch like count for a target (post or comment)
export const fetchLikeCount = createAsyncThunk(
  'likes/fetchLikeCount',
  async ({ targetType, targetId }) => {
    const res = await axios.get(
      `${API_BASE_URL}/likes/count?targetType=${targetType}&targetId=${targetId}`
    );
    // Inject targetId into the response
    return { targetId, count: res.data.count };
  }
);

// Fetch users who liked a target
export const fetchLikeUsers = createAsyncThunk(
  'likes/fetchLikeUsers',
  async ({ targetType, targetId }) => {
    const res = await axios.get(
      `${API_BASE_URL}/likes/users?targetType=${targetType}&targetId=${targetId}`
    );
    return { targetId, users: res.data.userIds };
  }
);

// Fetch like status for current user
export const fetchLikeStatus = createAsyncThunk(
  'likes/fetchLikeStatus',
  async ({ targetType, targetId, userId, sessionId }) => {
    const res = await axios.get(
      `${API_BASE_URL}/likes/status?targetType=${targetType}&targetId=${targetId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-appwrite-user-id': userId,
          'x-appwrite-session-id': sessionId,
        },
      }
    );
    // Inject targetId into the response
    return { targetId, liked: res.data.liked };
  }
);

// Toggle like (add or remove)
export const toggleLike = createAsyncThunk(
  'likes/toggleLike',
  async ({ targetType, targetId, userId, sessionId }) => {
    const res = await axios.post(
      `${API_BASE_URL}/likes/toggle`,
      { targetType, targetId },
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


const likesSlice = createSlice({
    name: 'likes',
    initialState: {
      counts: {},   // { [targetId]: number }
      users: {},    // { [targetId]: array }
      status: {},   // { [targetId]: true/false }
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchLikeCount.fulfilled, (state, action) => {
          const { targetId, count } = action.payload;
          state.counts[targetId] = count;
        })
        .addCase(fetchLikeUsers.fulfilled, (state, action) => {
          const { targetId, users } = action.payload;
          state.users[targetId] = users;
        })
        
        .addCase(fetchLikeStatus.fulfilled, (state, action) => {
          const { targetId, liked } = action.payload;
          state.status[targetId] = liked;
        })
        // Optimistic update: update state immediately on toggleLike.pending
        // In your reducer:
.addCase(toggleLike.pending, (state, action) => {
  // Only update the status optimistically, not the count
  const { targetId } = action.meta.arg;
  state.status[targetId] = !state.status[targetId];
})
.addCase(toggleLike.fulfilled, (state, action) => {
  const { targetId, userId, action: toggleAction } = action.payload;
  state.status[targetId] = toggleAction === 'added';
  // Update count based on backend confirmation
  if (toggleAction === 'added') {
    state.counts[targetId] = (state.counts[targetId] || 0) + 1;
  } else if (toggleAction === 'removed') {
    state.counts[targetId] = Math.max(0, (state.counts[targetId] || 1) - 1);
  }
})

        .addMatcher(
          (action) => action.type.endsWith('/rejected'),
          (state, action) => {
            state.error = action.error.message;
          }
        );
    },
  });
  
  export default likesSlice.reducer;
  
