// profileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createUserProfile, fetchUserProfile, updateUserProfile, registerUserAndCreateProfile } from './profileThunks';

const initialState = {
    profile: null,
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUserAndCreateProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUserAndCreateProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload.profile; // <-- Store the profile document
                state.error = null;
            })
            
            .addCase(registerUserAndCreateProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(createUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(createUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default profileSlice.reducer;