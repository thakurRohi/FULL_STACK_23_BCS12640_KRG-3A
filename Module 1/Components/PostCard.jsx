import React, { useState, useEffect } from 'react';
import appwriteService from "../appwrite/config";
import { Link, useNavigate } from 'react-router-dom';
import Likes from './Likes';
import ToggleBookmark from './ToggleBookmark';  // 🔑 Your BookmarkButton component
import { useSelector } from 'react-redux';
import ProfileService from '../appwrite/profile'

const userNameCache = {};
const USER_NAME_CACHE_KEY = 'userNameCache';

function getUserNameFromCache(userId) {
  if (userNameCache[userId]) return userNameCache[userId];
  const cache = JSON.parse(localStorage.getItem(USER_NAME_CACHE_KEY) || '{}');
  if (cache[userId]) {
    userNameCache[userId] = cache[userId];
    return cache[userId];
  }
  return null;
}
function setUserNameInCache(userId, name) {
  userNameCache[userId] = name;
  const cache = JSON.parse(localStorage.getItem(USER_NAME_CACHE_KEY) || '{}');
  cache[userId] = name;
  localStorage.setItem(USER_NAME_CACHE_KEY, JSON.stringify(cache));
}

function PostCard({ $id, title, featuredImage,userId }) {
  const userData = useSelector((state) => state.auth.userData);
 
  const sessionId = useSelector((state) => state.auth.sessionId);
  const post = useSelector(state => state.file.currentPost);
  const [authorName, setAuthorName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const cached = getUserNameFromCache(userId);
    if (cached) {
      setAuthorName(cached);
    } else {
      setAuthorName(''); // or userId, or 'User'
      async function fetchProfile() {
        try {
          const profile = await ProfileService.getProfile(userId);
          setAuthorName(profile.name);
          setUserNameInCache(userId, profile.name);
        } catch (error) {
          setAuthorName('Unknown');
        }
      }
      fetchProfile();
    }
  }, [userId]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // You can add more logic here if needed
  };
  
  return (
    <Link to={`/post/${$id}`} className="group block">
      <div className="w-full bg-white rounded-2xl p-0 shadow-md border border-slate-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 group-hover:scale-[1.03] overflow-hidden flex flex-col">

        {/* 🌄 Image + Bookmark */}
        <div className="relative w-full h-52 overflow-hidden">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none"></div>
         
          {/* 🔖 Bookmark Button on top-right */}
          <div className="absolute top-2 right-2 z-10">
            <ToggleBookmark
              targetType="post"
              targetId={$id}                         // 👈 Required for bookmarks
              userId={userData?.$id}                 // 👈 User ID
              sessionId={sessionId}                  // 👈 Session
            />
          </div>
        </div>

        <div
          className="block cursor-pointer"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            // navigate(`/user/${userId}`);
          }}
        >
          <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-100 bg-slate-50 w-full">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              {authorName ? authorName[0].toUpperCase() : userId ? userId[0].toUpperCase() : "?"}
            </div>
            <span className="text-sm text-slate-700 font-medium">
              {authorName || userId || <span className="italic text-slate-400">Loading...</span>}
            </span>
          </div>
        </div>

        {/* 📄 Post Info */}
        <div className="flex-1 flex flex-col justify-between p-5">
          <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 mb-2 line-clamp-2">
            {title}
          </h2>

          <Likes 
            targetType="post" 
            targetId={$id} 
            userId={userData?.$id} 
            sessionId={sessionId} 
          />

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Read More</span>
            <svg className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;