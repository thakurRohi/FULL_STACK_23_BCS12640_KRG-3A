import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toggleBookmark, checkBookmarkStatus } from '../store/BackendConfig/bookmarkSlice';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';  // Bookmark icons

const BookmarkButton = ({ targetId, sessionId, userId }) => {
  const dispatch = useDispatch();
  const isBookmarked = useSelector(state => state.bookmarks.bookmarkStatus[targetId]);
  const loading = useSelector(state => state.bookmarks.loading);

  useEffect(() => {
    if (sessionId && userId && targetId) {
      dispatch(checkBookmarkStatus({ targetType: 'post', targetId, sessionId, userId }));
    }
  }, [dispatch, sessionId, userId, targetId]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleBookmark({ targetType: 'post', targetId, sessionId, userId }));
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="text-xl text-gray-700 hover:text-blue-500 transition"
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarkButton;
