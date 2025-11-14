package com.blogapp.payload;

import javax.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
	
	private int id;
	
	@NotEmpty(message = "Comment content should not be empty.")
	private String content;
	
	private UserDto user;

}
