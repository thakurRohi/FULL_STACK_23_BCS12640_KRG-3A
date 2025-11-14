package com.blogapp.services.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.blogapp.entities.Category;
import com.blogapp.entities.Post;
import com.blogapp.entities.User;
import com.blogapp.exceptions.ResourceNotFoundException;
import com.blogapp.exceptions.SimplePlainTextException;
import com.blogapp.payload.PostDto;
import com.blogapp.payload.PostResponce;
import com.blogapp.repositories.CategoryRepo;
import com.blogapp.repositories.PostRepo;
import com.blogapp.repositories.UserRepo;
import com.blogapp.services.PostService;

@Service
public class PostServiceImpl implements PostService {

	@Autowired
	private PostRepo postRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private CategoryRepo categoryRepo;
	
	@Value("${project.image}")
	private String path;

	@Override
	public PostDto createPost(PostDto postDto, Integer userId, Integer categoryId) {

		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "ID", userId));

		Category category = this.categoryRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "ID", categoryId));

		Post post = this.modelMapper.map(postDto, Post.class);
//		post.setImageName("default.png");
		post.setAddedDate(new Date());
		post.setUser(user);
		post.setCategory(category);

		Post savedPost = this.postRepo.save(post);

		return this.modelMapper.map(savedPost, PostDto.class);
	}

	@Override
	public PostDto updatePost(PostDto postDto, Integer postId) {

		Post post = this.postRepo.findById(postId)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "Id", postId));

		post.setTitle(postDto.getTitle());
		post.setContent(postDto.getContent());
		post.setImageName(postDto.getImageName());

		Post updatedPost = this.postRepo.save(post);
		PostDto updatedPostDto = this.modelMapper.map(updatedPost, PostDto.class);

		return updatedPostDto;
	}

	@Override
	public void deletePost(Integer postId) {

		File file = null;
		Post post = this.postRepo.findById(postId)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "Id", postId));
		
		try {
			file = new File(path + File.separator + post.getImageName());
			if(file.delete()) {
				System.out.println("Image of post with ID " + post.getPostId() + " is deleted successfully...");
			}else {
				System.out.println("Image of post with ID " + post.getPostId() + " is not deleted successfully...");
				throw new SimplePlainTextException("File post with ID " + post.getPostId() + " is not deleted successfully...");
			}
		} catch (Exception e) {
			System.out.println("Image failed to delete...");
			e.printStackTrace();
		}

		this.postRepo.delete(post);
	}

	@Override
	public PostResponce getAllPosts(Integer pageNumber, Integer pageSize, String sortBy, String sortType) {

		Sort sort = (sortType.equalsIgnoreCase("asc")) ? (Sort.by(sortBy).ascending()) : (Sort.by(sortBy).descending());

		Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

		Page<Post> pagePost = this.postRepo.findAll(pageable);
		List<Post> allPosts = pagePost.getContent();

		List<PostDto> postDtos = allPosts.stream().map((post) -> this.modelMapper.map(post, PostDto.class))
				.collect(Collectors.toList());

		PostResponce postResponce = new PostResponce();
		postResponce.setContent(postDtos);
		postResponce.setPageNumber(pagePost.getNumber());
		postResponce.setPageSize(pagePost.getSize());
		postResponce.setTotalElements(pagePost.getTotalElements());
		postResponce.setTotalpages(pagePost.getTotalPages());
		postResponce.setLastpage(pagePost.isLast());

		return postResponce;
	}

	@Override
	public PostDto getPostById(Integer postId) {

		Post post = this.postRepo.findById(postId)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "Id", postId));
		PostDto postDto = this.modelMapper.map(post, PostDto.class);
		return postDto;
	}

	@Override
	public List<PostDto> getPostsByCategory(Integer categoryId) {

		Category category = this.categoryRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Caytegory", "ID", categoryId));

//		Sort sort = (sortType.equalsIgnoreCase("asc")) ? (sort = Sort.by(sortBy).ascending()) : (sort = Sort.by(sortBy).descending());
//		Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

		List<Post> postsByCategory = this.postRepo.findByCategory(category);

		List<PostDto> postDtos = postsByCategory.stream().map((post) -> this.modelMapper.map(post, PostDto.class))
				.collect(Collectors.toList());

		return postDtos;
	}

	@Override
	public List<PostDto> getPostsByUser(Integer userId) {

		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "Id", userId));

		List<Post> postsByUser = this.postRepo.findByUser(user);

		List<PostDto> postDtos = postsByUser.stream().map((post) -> this.modelMapper.map(post, PostDto.class))
				.collect(Collectors.toList());

		return postDtos;
	}

	@Override
	public List<PostDto> searchPost(String keyword) {

		List<Post> posts = this.postRepo.findByTitleContaining(keyword);
//		List<Post> posts = this.postRepo.searchByTitle("%" + keyword + "%");

		List<PostDto> postDtos = posts.stream().map((post) -> this.modelMapper.map(post, PostDto.class))
				.collect(Collectors.toList());

		return postDtos;
	}

//	---------------------------------------------Testing Service Implementation methods----------------------------------------------
//	---------------------------------------------------------------------------------------------------------------------------------

	// implementation to get categorywise posts with pagination and sorting
	@Override
	public PostResponce testGetAllPostByCategory(Integer categoryId, Integer pageNumber, Integer pageSize,
			String sortBy, String sortType) {

		this.categoryRepo.findById(categoryId)
				.orElseThrow(() -> new ResourceNotFoundException("Category", "Id", categoryId));

		Sort sort = (sortType.equalsIgnoreCase("asc")) ? (Sort.by(sortBy).ascending()) : (Sort.by(sortBy).descending());

		Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
		Page<Post> pagePost = this.postRepo.findAll(pageable);
		List<Post> allPosts = pagePost.getContent();

		List<Post> raw = new ArrayList<Post>();
//		Iterator<Post> iterator = raw.iterator();

		for (Post post : allPosts) {
			if (post.getCategory().getCategoryId() == categoryId) {
				raw.add(post);
			}
		}

		List<PostDto> postDtos = raw.stream().map((p) -> this.modelMapper.map(p, PostDto.class))
				.collect(Collectors.toList());

		PostResponce postResponce = new PostResponce();
		postResponce.setContent(postDtos);
		postResponce.setPageNumber(pagePost.getNumber());
		postResponce.setPageSize(pagePost.getSize());
		postResponce.setTotalElements(postDtos.size());
		postResponce.setTotalpages((int) (raw.size() / pagePost.getSize()));
		postResponce.setLastpage(pagePost.isLast());

		// logging for testing purpose.
		System.out.println(postResponce);

		return postResponce;
	}

	// implementation to get userwise posts with pagination and sorting
	@Override
	public PostResponce testGetAllPostByUser(Integer userId, Integer pageNumber, Integer pageSize, String sortBy,
			String sortType) {

		this.userRepo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", "ID", userId));

		Sort sort = (sortType.equalsIgnoreCase("asc")) ? (Sort.by(sortBy).ascending()) : (Sort.by(sortBy).descending());
		Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);

		Page<Post> pagePost = this.postRepo.findAll(pageable);
		List<Post> posts = pagePost.getContent();

		List<Post> raw = new ArrayList<Post>();

		for (Post post : posts) {
			if (post.getUser().getId() == userId) {
				raw.add(post);
			}
		}

		List<PostDto> postDtos = raw.stream().map((p) -> this.modelMapper.map(p, PostDto.class))
				.collect(Collectors.toList());

		PostResponce postResponce = new PostResponce();
		postResponce.setContent(postDtos);
		postResponce.setPageNumber(pagePost.getNumber());
		postResponce.setPageSize(pagePost.getSize());
		postResponce.setTotalElements(postDtos.size());
		postResponce.setTotalpages((int) (raw.size() / pagePost.getSize()));
		postResponce.setLastpage(pagePost.isLast());

		// logging for testing purpose.
		System.out.println(postResponce);

		return postResponce;
	}

}
