package com.blogapp.payload;

import java.util.Date;
import java.util.Set;

import javax.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

	private Integer postId;

	@NotEmpty(message = "Title should not be empty.")
	private String title;

	@NotEmpty(message = "Post content should not be empty.")
	private String content;
	private String imageName;
	private Date addedDate;

	private CategoryDto category;

	private UserDto user;
	
	private Set<CommentDto> comments;

}
