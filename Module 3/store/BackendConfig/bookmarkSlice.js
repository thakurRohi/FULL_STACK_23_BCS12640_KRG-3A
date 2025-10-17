import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Set your base API URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || '/vercel-api/api';

// Fetch bookmark status for current user
export const checkBookmarkStatus = createAsyncThunk(
  'bookmarks/checkBookmarkStatus',
  async ({ targetType, targetId, sessionId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/bookmarks/bookmarkStatus?targetType=${targetType}&targetId=${targetId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-user-id': userId,        // ✅ Required for Appwrite to know user identity
            'x-appwrite-session-id': sessionId,  // ✅ Required for session verification
          },
        }
      );
      return res.data.Bookmark;  // true or false
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to check bookmark status');
    }
  }
);

// Toggle like (add or remove)
export const toggleBookmark = createAsyncThunk(
  'bookmarks/toggleBookmark',
  async ({ targetType, targetId, sessionId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/bookmarks/toggleBookmark`,
        { targetType, targetId },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-user-id': userId,        // ✅ Required for Appwrite identity
            'x-appwrite-session-id': sessionId,  // ✅ Required for Appwrite session validation
          },
        }
      );
      return res.data; // { targetType, targetId, userId, action }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to toggle bookmark');
    }
  }
);

export const fetchBookmarkPosts = createAsyncThunk(
  'bookmarks/fetchBookmarkPosts',
  async ({ userId, page = 1, limit = 20, sessionId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/bookmarks/user/${userId}?page=${page}&limit=${limit}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-user-id': userId,         // ✅ Required for Appwrite
            'x-appwrite-session-id': sessionId,   // ✅ Required for Appwrite
          },
        }
      );
      return {
        posts: res.data.Bookmarks,
        pagination: res.data.pagination || { page, limit, total: 0, pages: 1 },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch bookmarks');
    }
  }
);

  

export const deleteBookmark = createAsyncThunk(
  'bookmarks/deleteBookmark',
  async ({ bookmarkId, sessionId, userId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/bookmarks/${bookmarkId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-user-id': userId,        // ✅ Appwrite needs this
            'x-appwrite-session-id': sessionId,  // ✅ Appwrite needs this
          },
        }
      );
      return { bookmarkId, message: res.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete bookmark');
    }
  }
);



  const bookmarkSlice = createSlice({
    name: 'bookmarks',
    initialState: {
      posts: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        pages: 1,
      },
      bookmarkStatus: {},  // { targetId: true/false }
      loading: false,
      error: null,
      toggleStatus: null, // <-- NEW: To store the last action ('added' or 'removed')
    },
 
    reducers: {
      setPage(state, action) {
        state.pagination.page = action.payload;
      },
      clearToggleStatus(state) {
        state.toggleStatus = null;
      },
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchBookmarkPosts.pending, (state) => {
          state.loading = true;
          state.error = null;
     
        })
        .addCase(fetchBookmarkPosts.fulfilled, (state, action) => {
          state.loading = false;
          state.posts = action.payload.posts || [];
          state.pagination = action.payload.pagination
        })
        .addCase(fetchBookmarkPosts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch bookmarks';
        })
        .addCase(toggleBookmark.pending, (state) => {
          state.toggleStatus = null;
          state.error = null
        })
        .addCase(toggleBookmark.fulfilled, (state, action) => {
        
          const { targetId, action: bookmarkAction } = action.payload;
          const postIndex = state.posts.findIndex(post => post.targetId === targetId);

          if (postIndex !== -1 && bookmarkAction === 'removed') {
            // Instantly remove the post from UI (optimistic update)
            state.posts.splice(postIndex, 1);
          }
          state.bookmarkStatus[targetId] = bookmarkAction === 'added';
          state.toggleStatus = bookmarkAction;
        })
        .addCase(toggleBookmark.rejected, (state, action) => {
          state.toggleStatus = null;
          state.error = action.payload;
        })

        .addCase(checkBookmarkStatus.fulfilled, (state, action) => {
          const { targetId } = action.meta.arg;
          state.bookmarkStatus[targetId] = action.payload;  // true or false
        })
        .addCase(checkBookmarkStatus.rejected, (state, action) => {
          state.error = action.payload;
        })
        

        .addCase(deleteBookmark.pending, (state) => {
          state.error = null;
          
        })
        .addCase(deleteBookmark.fulfilled, (state, action) => {
          const deletedId = action.payload.bookmarkId;
          state.posts = state.posts.filter(post => post._id !== deletedId);
          delete state.bookmarkStatus[deletedId];
        })
        .addCase(deleteBookmark.rejected, (state, action) => {
          state.error = action.payload;
        })
    },
  });
  export const { setPage } = bookmarkSlice.actions;
  export default bookmarkSlice.reducer;


  