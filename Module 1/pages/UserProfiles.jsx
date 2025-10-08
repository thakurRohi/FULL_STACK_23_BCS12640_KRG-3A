import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../store/userProfileSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFollowers, fetchFollowing } from '../store/BackendConfig/userFollowSlice';
import { fetchUserPosts } from '../store/fileThunks';


const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const UserProfiles = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // All useSelector hooks must be at the top level
  const { profile, loading, error } = useSelector((state) => state.userProfile);
  const sessionId = useSelector((state) => state.auth.sessionId);
  const followers = useSelector(state => state.follow.followers);
  const following = useSelector(state => state.follow.following);
  const posts = useSelector(state => state.file.userPosts);
  const followLoading = useSelector(state => state.follow.loading);
  const postsLoading = useSelector(state => state.file.fetchStatus === 'loading');

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      if (sessionId) {
        dispatch(fetchFollowing({ userId, sessionId }));
        dispatch(fetchFollowers({ userId, sessionId }));
      }
      dispatch(fetchUserPosts(userId));
    }
  }, [userId, dispatch, sessionId]);

  if (loading || followLoading || postsLoading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error) return <div className="text-center text-red-600 mt-10">Error: {error}</div>;
  if (!profile) return <div className="text-center text-gray-600 mt-10">No profile found.</div>;

  // Calculate counts after early returns
  const followersCount = followers?.length || 0;
  const followingCount = following?.length || 0;
  const postsCount = posts?.length || 0;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-md p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
      {/* Left Side: Profile Pic/Initials and Stats */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        {/* Profile Picture or Initials */}
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 mb-4">
          {profile?.profilePicUrl ? (
            <img src={profile.profilePicUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
          ) : (
            getInitials(profile?.name || profile?.username || 'U')
          )}
        </div>
        {/* Stats */}
        <div className="flex flex-col gap-2 w-full">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-800">{postsCount}</div>
            <div className="text-gray-500 text-sm">Posts</div>
          </div>
          <button 
          onClick={()=>{
            navigate(`/follow-details/${userId}`)
          }}
          className="text-center">
            <div className="text-xl font-bold text-gray-800">{followersCount}</div>
            <div className="text-gray-500 text-sm">Followers</div>
          </button>

          <button 
          onClick={()=>{
            navigate(`/following-details/${userId}`)
          }}
          className="text-center">
            <div className="text-xl font-bold text-gray-800">{followingCount}</div>
            <div className="text-gray-500 text-sm">Following</div>
          </button>
          
        </div>
      </div>
      {/* Right Side: User Info */}
      <div className="flex-1 flex flex-col items-center md:items-start w-full">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-lg font-semibold text-gray-700">@{profile?.username || 'username'}</span>
          <button className="px-4 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm">Follow</button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile?.name || 'No Name'}</h2>
        <p className="text-gray-500 mb-2">{profile?.email || 'No Email'}</p>
        <p className="text-gray-600 mb-4">{profile?.bio || 'No bio provided.'}</p>
      </div>
    </div>
  );
};

export default UserProfiles;