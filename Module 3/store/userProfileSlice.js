// blog/blogger/src/store/userProfileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../appwrite/profile';
// Async thunk to fetch user profile by ID
export const fetchUserProfile = createAsyncThunk(
  'userProfile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue('User ID is required');
      }

      const profile = await profileService.getProfile(userId);
      if (!profile) {
        return rejectWithValue('User profile not found');
      }
      return profile;
    } catch (error) {
      console.error('fetchUserProfile error:', error);
      
      // Handle different types of errors
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('Network error detected'))) {
        return rejectWithValue('Network error: Unable to connect to server. Please check your internet connection and try again.');
      }
      
      if (error.code === 404) {
        return rejectWithValue('User profile not found');
      }
      
      if (error.code === 401) {
        return rejectWithValue('Authentication required');
      }
      
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;