import service from '../appwrite/config';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createPost = createAsyncThunk(
    'post/createPost',
    async ({ postData, imageFile }, { rejectWithValue }) => {
      try {
              // Step 1: Upload image if provided
        let featuredImageId = null;
        if (imageFile) {
            const uploadedImage = await service.uploadFile(imageFile);
            featuredImageId = uploadedImage.$id;
          }

             // Step 2: Create post with image reference
      const newPost = await service.createPost({
        ...postData,
        featuredImage: featuredImageId
      });

          // Step 3: Return complete post data for Redux store
      return newPost;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const updatePost = createAsyncThunk(
    'post/updatePost',
    async ({ postId, postData, imageFile }, { rejectWithValue }) => {
      try {
              // Step 1: Upload image if provided
        let featuredImageId = postData.featuredImage || null;
        if (imageFile) {
            const uploadedImage = await service.uploadFile(imageFile);
            featuredImageId = uploadedImage.$id;
          }

             // Step 2: Create post with image reference
      const updatedPost  = await service.updatePost(postId,{
        ...postData,
        featuredImage: featuredImageId
      });

          // Step 3: Return complete post data for Redux store
      return updatedPost ;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const deletePost = createAsyncThunk(
    'post/deletePost',
    async ({ postId, featuredImageId  }, { rejectWithValue }) => {
      try {
                  // Delete the post from the database
                  await service.deletePost(postId);

                 // Optionally, delete the associated image if it exists
      if (featuredImageId) {
        await service.deleteFile(featuredImageId);
      }

         
      // Return the postId and imageId for state update in the slice
      return { postId, featuredImageId };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  
  export const fetchUserPosts = createAsyncThunk(
    'posts/fetchUserPosts',
    async (userId, { rejectWithValue }) => {
      try {
        // Call your Appwrite service to fetch posts for the given user ID
        const userPosts = await service.getUserPosts(userId);
        return userPosts; // Return the array of user's posts
      } catch (error) {
        // Handle network errors specifically
        if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('Network error detected'))) {
          return rejectWithValue('Network error: Unable to fetch user posts. Please check your internet connection and try again.');
        }
        return rejectWithValue(error.message);
      }
    }
  );

  export const fetchAllPosts = createAsyncThunk(
    'posts/fetchAllPosts',
    async (_, { rejectWithValue }) => {
      try {
        const posts = await service.getPosts();
        return posts.documents;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const fetchPostBySlug = createAsyncThunk(
    'posts/fetchPostBySlug',
    async (slug, { rejectWithValue }) => {
      try {
        const post = await service.getPost(slug);
        return post;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async (file, { rejectWithValue }) => {
      try {
        const uploadedFile = await service.uploadFile(file);
        return uploadedFile.$id; // Return the file ID
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const deleteFile = createAsyncThunk(
    'files/deleteFile',
    async (fileId, { rejectWithValue }) => {
      try {
        // Delete the file using your Appwrite service
        await service.deleteFile(fileId);
        // Return the fileId to update state or for further processing
        return fileId;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


  export const getFilePreview = createAsyncThunk(
  'files/getFilePreview',
  async ({ fileId, width = 0, height = 0, gravity = 'center', quality = -1, borderWidth = 0, borderColor = '', borderRadius = 0, opacity = 1, rotation = 0, background = '', output = 'jpg' }, { rejectWithValue }) => {
    try {
      // Call your Appwrite service to get the preview URL
      const previewUrl = await service.getFilePreview(
        fileId,
        width,
        height,
        gravity,
        quality,
        borderWidth,
        borderColor,
        borderRadius,
        opacity,
        rotation,
        background,
        output
      );
      return { fileId, previewUrl };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
  );

  // Search posts thunk
  export const searchPosts = createAsyncThunk(
    'posts/searchPosts',
    async ({ searchTerm, filters = [] }, { rejectWithValue }) => {
      try {
        const searchResults = await service.searchPosts(searchTerm, filters);
        return {
          documents: searchResults.documents || [],
          total: searchResults.total || 0,
          searchTerm,
          filters
        };
      } catch (error) {
        console.error('Search error:', error);
        return rejectWithValue(error.message || 'Search failed');
      }
    }
  );

