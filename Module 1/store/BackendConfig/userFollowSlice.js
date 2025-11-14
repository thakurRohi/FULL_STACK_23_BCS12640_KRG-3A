import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/vercel-api/api';

// Fetch followers
export const fetchFollowers = createAsyncThunk(
  'follow/fetchFollowers',
  async ({ userId, sessionId }) => {
    const res = await axios.get(`${API_BASE_URL}/follow/followers/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Fetch following
export const fetchFollowing = createAsyncThunk(
  'follow/fetchFollowing',
  async ({ userId, sessionId }) => {
    const res = await axios.get(`${API_BASE_URL}/follow/following/${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Fetch pending follow requests
export const fetchPendingRequests = createAsyncThunk(
  'follow/fetchPendingRequests',
  async ({ userId, sessionId }) => {
    const res = await axios.get(`${API_BASE_URL}/follow/requests/pending`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Send follow request
export const sendFollowRequest = createAsyncThunk(
  'follow/sendFollowRequest',
  async ({ userId, sessionId, targetUserId }) => {
    const res = await axios.post(`${API_BASE_URL}/follow/${targetUserId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Unfollow user
export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async ({ userId, sessionId, targetUserId }) => {
    const res = await axios.delete(`${API_BASE_URL}/follow/${targetUserId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Accept follow request
export const acceptFollowRequest = createAsyncThunk(
  'follow/acceptFollowRequest',
  async ({ userId, sessionId, followerId }) => {
    const res = await axios.post(`${API_BASE_URL}/follow/accept/${followerId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

// Reject follow request
export const rejectFollowRequest = createAsyncThunk(
  'follow/rejectFollowRequest',
  async ({ userId, sessionId, followerId }) => {
    const res = await axios.post(`${API_BASE_URL}/follow/reject/${followerId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-User-Id': userId,
          'X-Appwrite-Session-Id': sessionId,
        },
      }
    );
    return res.data;
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followers: [],
    following: [],
    pendingRequests: [],
    loading: false,
    error: null,
    actionMessage: null,
  },
  reducers: {
    clearActionMessage(state) {
      state.actionMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch followers
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch following
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      })
      // Fetch pending requests
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload;
      })
      // Send follow request
      .addCase(sendFollowRequest.fulfilled, (state, action) => {
        state.actionMessage = action.payload.message;
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.actionMessage = action.payload.message;
      })
      // Accept follow request
      .addCase(acceptFollowRequest.fulfilled, (state, action) => {
        state.actionMessage = action.payload.message;
      })
      // Reject follow request
      .addCase(rejectFollowRequest.fulfilled, (state, action) => {
        state.actionMessage = action.payload.message;
      });
  },
});

export const { clearActionMessage } = followSlice.actions;
export default followSlice.reducer;

