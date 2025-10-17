import { createSlice } from '@reduxjs/toolkit';
import { 
    createPost, 
    updatePost, 
    deletePost,
    fetchUserPosts,
    fetchAllPosts,
    uploadFile,
    deleteFile,
    getFilePreview,
    fetchPostBySlug,
    searchPosts
} from './fileThunks';

const initialState = {
    uploadStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    previewStatus: 'idle',
    deleteStatus: 'idle',
    fileId: null,
    previewUrl: null,
    error: null,
    userPosts: [],
    progress: 0, // Progress percentage for file upload (0-100)
    currentPost: null,
    currentPostStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    // Search related state
    searchResults: [],
    searchStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    searchTerm: '',
    searchFilters: [],
    searchTotal: 0,
  };

  const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
      resetFileState: (state) => {
        Object.assign(state, initialState);
      }
    },

    extraReducers: (builder) => {
        builder
          // Create Post
          .addCase(createPost.pending, (state) => {
            state.uploadStatus = 'loading';
            state.error = null;
          })
          .addCase(createPost.fulfilled, (state, action) => {
            state.uploadStatus = 'succeeded';
            state.fileId = action.payload.$id || null;
            state.error = null;
          })
          .addCase(createPost.rejected, (state, action) => {
            state.uploadStatus = 'failed';
            state.error = action.payload;
          })
          
          // Update Post
          .addCase(updatePost.pending, (state) => {
            state.uploadStatus = 'loading';
            state.error = null;
          })
          .addCase(updatePost.fulfilled, (state, action) => {
            state.uploadStatus = 'succeeded';
            state.fileId = action.payload && action.payload.$id ? action.payload.$id : null;
            state.error = null;
          })
          .addCase(updatePost.rejected, (state, action) => {
            state.uploadStatus = 'failed';
            state.error = action.payload;
          })
          
          // Delete Post
          .addCase(deletePost.pending, (state) => {
            state.deleteStatus = 'loading';
            state.error = null;
          })
          .addCase(deletePost.fulfilled, (state, action) => {
            state.deleteStatus = 'succeeded';
            state.fileId = null;
            state.previewUrl = null;
            state.error = null;
          })
          .addCase(deletePost.rejected, (state, action) => {
            state.deleteStatus = 'failed';
            state.error = action.payload;
          })
          
          // Fetch User Posts
          .addCase(fetchUserPosts.pending, (state) => {
            state.fetchStatus = 'loading';
            state.error = null;
          })
          .addCase(fetchUserPosts.fulfilled, (state, action) => {
            state.fetchStatus = 'succeeded';
            state.userPosts = action.payload?.documents || [];
            state.error = null;
          })
          .addCase(fetchUserPosts.rejected, (state, action) => {
            state.fetchStatus = 'failed';
            state.error = action.payload;
          })
          
          // Fetch All Posts
          .addCase(fetchAllPosts.pending, (state) => {
            state.fetchStatus = 'loading';
            state.error = null;
          })
          .addCase(fetchAllPosts.fulfilled, (state, action) => {
            state.fetchStatus = 'succeeded';
            state.files = action.payload || [];
            state.error = null;
          })
          .addCase(fetchAllPosts.rejected, (state, action) => {
            state.fetchStatus = 'failed';
            state.error = action.payload;
          })
          
          // Upload File
          .addCase(uploadFile.pending, (state) => {
            state.uploadStatus = 'loading';
            state.progress = 0;
            state.error = null;
          })
          .addCase(uploadFile.fulfilled, (state, action) => {
            state.uploadStatus = 'succeeded';
            state.fileId = action.payload;
            state.progress = 100;
            state.error = null;
          })
          .addCase(uploadFile.rejected, (state, action) => {
            state.uploadStatus = 'failed';
            state.error = action.payload;
            state.progress = 0;
          })
          
          // Delete File
          .addCase(deleteFile.pending, (state) => {
            state.deleteStatus = 'loading';
            state.error = null;
          })
          .addCase(deleteFile.fulfilled, (state, action) => {
            state.deleteStatus = 'succeeded';
            state.fileId = null;
            state.previewUrl = null;
            state.error = null;
          })
          .addCase(deleteFile.rejected, (state, action) => {
            state.deleteStatus = 'failed';
            state.error = action.payload;
          })
          
          // Get File Preview
          .addCase(getFilePreview.pending, (state) => {
            state.previewStatus = 'loading';
            state.error = null;
          })
          .addCase(getFilePreview.fulfilled, (state, action) => {
            state.previewStatus = 'succeeded';
            state.previewUrl = action.payload.previewUrl || null;
            state.error = null;
          })
          .addCase(getFilePreview.rejected, (state, action) => {
            state.previewStatus = 'failed';
            state.error = action.payload;
          })
          
          // Fetch Single Post by Slug
          .addCase(fetchPostBySlug.pending, (state) => {
            state.currentPostStatus = 'loading';
            state.currentPost = null;
            state.error = null;
          })
          .addCase(fetchPostBySlug.fulfilled, (state, action) => {
            state.currentPostStatus = 'succeeded';
            state.currentPost = action.payload;
            state.error = null;
          })
          .addCase(fetchPostBySlug.rejected, (state, action) => {
            state.currentPostStatus = 'failed';
            state.currentPost = null;
            state.error = action.payload;
          })
          
          // Search Posts
          .addCase(searchPosts.pending, (state) => {
            state.searchStatus = 'loading';
            state.error = null;
          })
          .addCase(searchPosts.fulfilled, (state, action) => {
            state.searchStatus = 'succeeded';
            state.searchResults = action.payload.documents || [];
            state.searchTerm = action.payload.searchTerm;
            state.searchFilters = action.payload.filters;
            state.searchTotal = action.payload.total;
            state.error = null;
          })
          .addCase(searchPosts.rejected, (state, action) => {
            state.searchStatus = 'failed';
            state.searchResults = [];
            state.error = action.payload;
          });
      }
    });
  
export default fileSlice.reducer;
