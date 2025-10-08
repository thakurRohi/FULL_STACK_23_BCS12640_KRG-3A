import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmarkPosts, setPage, deleteBookmark } from '../store/BackendConfig/bookmarkSlice';
import { Link } from 'react-router-dom';

const Bookmarks = () => {
  const dispatch = useDispatch();
  const { posts, pagination, loading, error } = useSelector(state => state.bookmarks);
  const sessionId = useSelector(state => state.auth.sessionId);
  const userId = useSelector(state => state.auth.userData?.$id);

  useEffect(() => {
    if (sessionId && userId) {
      dispatch(fetchBookmarkPosts({ userId, sessionId, page: pagination.page, limit: pagination.limit }));
    }
  }, [dispatch, sessionId, userId, pagination.page, pagination.limit]);

  if (loading) return <p className="text-center text-blue-600 font-medium mt-10">Loading bookmarks...</p>;
  if (error) return <p className="text-center text-red-600 font-medium mt-10">Error: {error}</p>;
  if (!sessionId || !userId) return <p className="text-center text-yellow-600 font-medium mt-10">Please log in to view your bookmarks.</p>;

  const handleDeleteBookmark = async (bookmarkId, e) => {
    e.preventDefault(); // Prevent navigation to post
    e.stopPropagation(); // Prevent event bubbling
    
    if (window.confirm('Are you sure you want to remove this bookmark?')) {
      try {
        await dispatch(deleteBookmark({ bookmarkId, sessionId, userId })).unwrap();
        // Success - bookmark is automatically removed from state
      } catch (error) {
        console.error('Failed to delete bookmark:', error);
        // You could show a toast notification here
      }
    }
  };

  return (
    <div className="w-full py-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-2">🔖 My Bookmarked Posts</h1>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">You haven’t bookmarked any posts yet.</p>
        ) : (
          <>
            <div className="space-y-4">
  {posts.map((post, index) => {
    const bgColors = ['bg-blue-50', 'bg-purple-50', 'bg-green-50', 'bg-yellow-50', 'bg-pink-50'];
    const bgColor = bgColors[index % bgColors.length];

    return (
      <div key={post._id} className={`p-4 rounded-lg border shadow-md transition-all hover:shadow-lg hover:border-blue-400 ${bgColor} relative`}>
        <Link to={`/post/${post.targetId}`} className="block">
          <p className="text-base font-semibold text-blue-800">📄 Post ID: {post.targetId}</p>
          <p className="text-sm text-gray-600 mt-1">
            Bookmarked on: <span className="font-mono">{new Date(post.createdAt).toLocaleDateString()}</span>
          </p>
        </Link>
        
        {/* Delete Button */}
        <button
          onClick={(e) => handleDeleteBookmark(post._id, e)}
          className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          title="Remove bookmark"
          aria-label="Remove bookmark"
        >
          🗑️
        </button>
      </div>
    );
  })}
</div>


            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => dispatch(setPage(pagination.page - 1))}
                  className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>

                <span className="text-sm font-medium text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>

                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => dispatch(setPage(pagination.page + 1))}
                  className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
