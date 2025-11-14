// src/hooks/useSocketListeners.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import socket from "../socket/socket";
import { addComment, updateComment, deleteComment } from "../store/BackendConfig/commentsSlice";
import { toggleLike } from "../store/BackendConfig/likesSlice";

const useSocketListeners = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Comments
    socket.on("newComment", (comment) => {
      dispatch(addComment(comment));
    });
    socket.on("commentUpdated", (comment) => {
      dispatch(updateComment(comment));
    });
    socket.on("commentDeleted", (commentId) => {
      dispatch(deleteComment(commentId));
    });

    // Likes
    socket.on("likeToggled", (data) => {
      dispatch(toggleLike(data));
    });

    // Cleanup
    return () => {
      socket.off("newComment");
      socket.off("commentUpdated");
      socket.off("commentDeleted");
      socket.off("likeToggled");
    };
  }, [dispatch]);
};

export default useSocketListeners;