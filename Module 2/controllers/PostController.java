package com.blogapp.controllers;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.hibernate.engine.jdbc.StreamUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.blogapp.config.AppConstants;
import com.blogapp.exceptions.AlreadyExistsException;
import com.blogapp.payload.ApiResponse;
import com.blogapp.payload.PostDto;
import com.blogapp.payload.PostResponce;
import com.blogapp.services.FileService;
import com.blogapp.services.PostService;

@RestController
@RequestMapping("/api")
public class PostController {

	@Autowired
	private PostService postService;

	@Autowired
	private FileService fileService;

	@Value("${project.image}")
	private String path;

	// API to create post
	@PostMapping("/user/{userId}/category/{categoryId}/posts")
	public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostDto postDto, @PathVariable("userId") Integer uId,
			@PathVariable("categoryId") Integer catId) {

		PostDto createdPost = this.postService.createPost(postDto, uId, catId);
		return new ResponseEntity<PostDto>(createdPost, HttpStatus.CREATED);
	}

	// API to get posts of specific user
	@GetMapping("/user/{userId}/posts")
	public ResponseEntity<List<PostDto>> getPostsByUser(@PathVariable("userId") Integer uId) {

		List<PostDto> postDtos = this.postService.getPostsByUser(uId);
		return new ResponseEntity<List<PostDto>>(postDtos, HttpStatus.OK);
	}

	// API to get posts of specific category
	@GetMapping("/category/{categoryId}/posts")
	public ResponseEntity<List<PostDto>> getPostsByCategory(@PathVariable("categoryId") Integer cId) {

		List<PostDto> postDtos = this.postService.getPostsByCategory(cId);
		return new ResponseEntity<List<PostDto>>(postDtos, HttpStatus.OK);
	}

	// API to get all the posta from database with pagination and sorting
	@GetMapping("/posts")
	public ResponseEntity<PostResponce> getAllPosts(
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
			@RequestParam(value = "sortType", defaultValue = AppConstants.SORT_TYPE, required = false) String sortType) {

		PostResponce postResponce = this.postService.getAllPosts(pageNumber, pageSize, sortBy, sortType);
		return new ResponseEntity<PostResponce>(postResponce, HttpStatus.OK);
	}

	// API to get post by its ID
	@GetMapping("/posts/{postId}")
	public ResponseEntity<PostDto> getOnePost(@PathVariable("postId") Integer pId) {

		PostDto postDto = this.postService.getPostById(pId);
		return new ResponseEntity<PostDto>(postDto, HttpStatus.OK);
	}

	// API to delete post Id wise
	@DeleteMapping("/posts/{postId}")
	public ResponseEntity<ApiResponse> deletePostById(@PathVariable("postId") Integer pId) {

		this.postService.deletePost(pId);
		return new ResponseEntity<ApiResponse>(new ApiResponse("Post deleted successfully.", true), HttpStatus.OK);
	}

	// API to update post details
	@PutMapping("/posts/{postId}")
	public ResponseEntity<PostDto> updatePostById(@Valid @RequestBody PostDto postDto,
			@PathVariable("postId") Integer pId) {

		PostDto updatePost = this.postService.updatePost(postDto, pId);
		return new ResponseEntity<PostDto>(updatePost, HttpStatus.OK);
	}

	// API to search posts using keyword
	@GetMapping("/posts/search/{keywords}")
	public ResponseEntity<List<PostDto>> searchPostByTitle(@PathVariable("keywords") String kw) {

		List<PostDto> searchPost = this.postService.searchPost(kw);
		return new ResponseEntity<List<PostDto>>(searchPost, HttpStatus.OK);
	}

//  -------------------------------------------------Image/File Upload and retrieve----------------------------------------------------
//	-----------------------------------------------------------------------------------------------------------------------------------

	// API to upload and save image into folder.
	@PostMapping("/post/image/upload/{postId}")
	public ResponseEntity<PostDto> imageUpload(@RequestParam("image") MultipartFile image,
			@PathVariable("postId") Integer pId) throws IOException, AlreadyExistsException {

		PostDto postDto = this.postService.getPostById(pId);
		File file = null;
		String fileName = null;

		// Condition 1 : Set image for new post
		// and store it in folder.
		if (postDto.getImageName() == null || postDto.getImageName().equals("")) {
			
			fileName = this.fileService.uploadImage(path, image, Integer.toString(pId));

			postDto.setImageName(fileName);
			PostDto updatedPOstDto = this.postService.updatePost(postDto, pId);
			System.out.println("New image set successfully...");

			return new ResponseEntity<PostDto>(updatedPOstDto, HttpStatus.OK);
		}

		// Condition 2 : If image already exists then delete it from
		// the folder and update it with new image.
		if (postDto.getImageName() != null || postDto.getImageName() != "") {
			try {
				file = new File(path + File.separator + postDto.getImageName());
				if (file.delete()) {
					fileName = this.fileService.uploadImage(path, image, Integer.toString(pId));
					System.out.println("Existing image deleted successfully...\nSaving new image...\nSaved successfully !!");
				} else {
					System.out.println("File not deleted successfully...");
					throw new AlreadyExistsException("Image for this post is already exists : unable to delete");
				}
			} catch (Exception e) {
				System.out.println("Failed to Delete image !!");
				throw new AlreadyExistsException("Image for this post is already exists : Fail to delete");
			}
		}

		postDto.setImageName(fileName);
		PostDto updatedPOstDto = this.postService.updatePost(postDto, pId);

		return new ResponseEntity<PostDto>(updatedPOstDto, HttpStatus.OK);
	}

	// API to serve/retrieve file
	@GetMapping(value = "post/image/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
	public void downlaodImage(@PathVariable("imageName") String imageaName, HttpServletResponse response)
			throws IOException {

		InputStream resource = this.fileService.getResource(path, imageaName);

		response.setContentType(MediaType.IMAGE_JPEG_VALUE);
		StreamUtils.copy(resource, response.getOutputStream());

	}

//	------------------------------------------------------Testing API area starts here-----------------------------------------------
//  ---------------------------------------------------------------------------------------------------------------------------------

	// API to get categorywise all the posts from database with pagination and
	// sorting
	@GetMapping("/test-posts/{categoryId}")
	public ResponseEntity<PostResponce> testGetAllPostsCategory(@PathVariable("categoryId") Integer cId,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
			@RequestParam(value = "sortType", defaultValue = AppConstants.SORT_TYPE, required = false) String sortType) {

		PostResponce postResponce = this.postService.testGetAllPostByCategory(cId, pageNumber, pageSize, sortBy,
				sortType);
		return new ResponseEntity<PostResponce>(postResponce, HttpStatus.OK);
	}

	// API to get userwise all the posts from database with pagination and sorting
	@GetMapping("/test-posts-user/{userID}")
	public ResponseEntity<PostResponce> testGetAllPostsUser(@PathVariable("userID") Integer uId,
			@RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
			@RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
			@RequestParam(value = "sortType", defaultValue = AppConstants.SORT_TYPE, required = false) String sortType) {

		PostResponce postResponce = this.postService.testGetAllPostByUser(uId, pageNumber, pageSize, sortBy, sortType);
		return new ResponseEntity<PostResponce>(postResponce, HttpStatus.OK);
	}
}
