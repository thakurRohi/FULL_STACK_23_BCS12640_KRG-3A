import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments ,addComment,
  updateComment,
  deleteComment
} from "../store/BackendConfig/commentsSlice";

export default function Comments({  postId, content, parentCommentId, userId, sessionId ,commentId }) {
  const dispatch = useDispatch();
  const { items: comments, status, error } = useSelector((state) => state.comments);
  const { userData } = useSelector((state) => state.auth);
  const [localLoading, setLocalLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  

  useEffect(() => {
    if (postId) {
      setLocalLoading(true);
      // dispatch(resetComments());
      Promise.resolve().then(() => {
        dispatch(fetchComments({ postId })).then(() => setLocalLoading(false));
      });
    }
  }, [dispatch, postId]);

  if (localLoading || status === "loading") {
    return (
      <div className="mt-8 bg-white rounded-xl shadow p-6 border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <p className="text-slate-500">Loading comments...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-8 bg-white rounded-xl shadow p-6 border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (status === "succeeded" && (!comments || comments.length === 0)) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow p-6 border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {/* Add Comment Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newComment.trim()) return;
            setActionLoading(true);
            await dispatch(addComment({ postId, content: newComment, parentCommentId: null, userId, sessionId }));
            await dispatch(fetchComments({ postId }));
            setNewComment("");
            setActionLoading(false);
          }}
          className="mb-4"
        >
          <textarea
            className="w-full border rounded p-2 mb-2"
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={actionLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={actionLoading}
          >
            {actionLoading ? "Adding..." : "Add Comment"}
          </button>
        </form>
        <p className="text-slate-500">No comments yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-slate-200 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2m10-4H7a2 2 0 00-2 2v0a2 2 0 002 2h10a2 2 0 002-2v0a2 2 0 00-2-2z" /></svg>
        Comments
      </h2>
      {/* Add Comment Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newComment.trim()) return;
          setActionLoading(true);
          await dispatch(addComment({ postId, content: newComment, parentCommentId: null, userId, sessionId }));
          await dispatch(fetchComments({ postId }));
          setNewComment("");
          setActionLoading(false);
        }}
        className="mb-6"
              >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
              {userData?.name ? userData.name[0]?.toUpperCase() : userData?.email ? userData.email[0]?.toUpperCase() : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            </div>
            <div className="flex-1">
            <textarea
              className="w-full border border-slate-300 rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:bg-slate-100"
              rows={2}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={actionLoading}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50 shadow"
                disabled={actionLoading}
              >
                {actionLoading ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ul className="space-y-6">
        {comments.map((comment) => (
          <li key={comment._id} className="border-b last:border-b-0 pb-6 last:pb-0 flex gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg mt-1">
              {comment.userName ? comment.userName[0]?.toUpperCase() : comment.userEmail ? comment.userEmail[0]?.toUpperCase() : <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-1 justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 mr-2">{comment.userName || comment.userEmail?.split('@')[0] || comment.userId}</span>
                  <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                {/* Three-dot menu for user's own comments */}
                {comment.userId === userId && (
                  <div className="relative">
                    <button
                      className="p-1 rounded-full hover:bg-slate-100 focus:outline-none transition"
                      onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)}
                      disabled={actionLoading}
                      aria-label="Open menu"
                      type="button"
                    >
                      <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="4" cy="10" r="2" />
                        <circle cx="10" cy="10" r="2" />
                        <circle cx="16" cy="10" r="2" />
                      </svg>
                    </button>
                    {openMenuId === comment._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-20 animate-fade-in">
                        {(() => {
                          const EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
                          const createdAtMs = new Date(comment.createdAt).getTime();
                          const nowMs = Date.now();
                          const canEdit = nowMs - createdAtMs < EDIT_WINDOW_MS;
                          return (
                            <>
                              {canEdit && (
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition"
                                  onClick={() => {
                                    setEditCommentId(comment._id);
                                    setEditContent(comment.content);
                                    setOpenMenuId(null);
                                  }}
                                  disabled={actionLoading}
                                >
                                  Edit
                                </button>
                              )}
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                                onClick={async () => {
                                  setOpenMenuId(null);
                                  if (window.confirm("Delete this comment?")) {
                                    setActionLoading(true);
                                    await dispatch(deleteComment({ commentId: comment._id, userId, sessionId }));
                                    await dispatch(fetchComments({ postId }));
                                    setActionLoading(false);
                                  }
                                }}
                                disabled={actionLoading}
                              >
                                Delete
                              </button>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {editCommentId === comment._id ? (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!editContent.trim()) return;
                    setActionLoading(true);
                    await dispatch(updateComment({ commentId: comment._id, content: editContent, userId, sessionId }));
                    await dispatch(fetchComments({ postId }));
                    setEditCommentId(null);
                    setEditContent("");
                    setActionLoading(false);
                  }}
                  className="mb-2"
                >
                  <textarea
                    className="w-full border border-slate-300 rounded-lg p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition disabled:bg-slate-100"
                    rows={2}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    disabled={actionLoading}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-1.5 rounded-lg font-semibold disabled:opacity-50 shadow"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-200 hover:bg-gray-300 transition text-gray-700 px-4 py-1.5 rounded-lg font-semibold"
                      onClick={() => {
                        setEditCommentId(null);
                        setEditContent("");
                      }}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-slate-800 mb-2 text-base leading-relaxed text-left">{comment.content}</div>
              )}
              {/* Show edit window expired message if not editable */}
              {comment.userId === userId && editCommentId !== comment._id && (() => {
                const EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
                const createdAtMs = new Date(comment.createdAt).getTime();
                const nowMs = Date.now();
                const canEdit = nowMs - createdAtMs < EDIT_WINDOW_MS;
                return !canEdit ? (
                  <div className="inline-flex items-center gap-1 text-xs text-slate-400 italic mt-1">
                    <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 8v.01" /></svg>
                    Edit window expired
                  </div>
                ) : null;
              })()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 