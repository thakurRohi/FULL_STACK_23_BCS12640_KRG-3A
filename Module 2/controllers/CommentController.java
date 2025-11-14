package com.blogapp.controllers;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogapp.payload.ApiResponse;
import com.blogapp.payload.CommentDto;
import com.blogapp.services.CommentService;

@RestController
@RequestMapping("/api")
public class CommentController {

	@Autowired
	private CommentService commentService;

	// API to create comment
	@PostMapping("/post/{postId}/user/{uId}/comment")
	public ResponseEntity<CommentDto> createComment(@Valid @RequestBody CommentDto commentDto,
			@PathVariable("postId") Integer pId,
			@PathVariable("uId") Integer uId) {

		CommentDto createComment = this.commentService.createComment(commentDto, pId, uId);
		return new ResponseEntity<CommentDto>(createComment, HttpStatus.CREATED);
	}

	// API to delete comment
	@DeleteMapping("/comment/{commentId}")
	public ResponseEntity<ApiResponse> deleteComment(@PathVariable("commentId") Integer cId) {

		this.commentService.deleteComment(cId);
		return new ResponseEntity<ApiResponse>(new ApiResponse("Comment deleted successfully.", true), HttpStatus.OK);
	}

}
