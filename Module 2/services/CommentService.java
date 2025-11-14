package com.blogapp.services;

import com.blogapp.payload.CommentDto;

public interface CommentService {

	// Create comment service method
	CommentDto createComment(CommentDto commentDto, Integer postId, Integer userId);
	
	// delete comment
	void deleteComment(Integer commentId);
}
