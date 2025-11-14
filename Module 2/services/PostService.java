package com.blogapp.services;

import java.util.List;

import com.blogapp.payload.PostDto;
import com.blogapp.payload.PostResponce;

public interface PostService {
	
	PostDto createPost(PostDto postDto, Integer postId, Integer categoryId);
	
	PostDto updatePost(PostDto postDto, Integer postId);
	
	void deletePost(Integer postId);
	
	// get all posts from the table.
	PostResponce getAllPosts(Integer pageNumber, Integer pageSize, String sortBy, String sortType);
	
	// get post by its own ID
	PostDto getPostById(Integer postId);
	
	// get posts by category
	List<PostDto> getPostsByCategory(Integer categoryId);
	
	// get posts by user
	List<PostDto> getPostsByUser(Integer userId);
	
	// search post
	List<PostDto> searchPost(String keyword);
	
	// testing methods
	PostResponce testGetAllPostByCategory(Integer categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortType);
	PostResponce testGetAllPostByUser(Integer userId, Integer pageNumber, Integer pageSize, String sortBy, String sortType);
}
