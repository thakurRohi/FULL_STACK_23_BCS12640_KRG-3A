package com.blogapp.payload;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {
	
	private Integer categoryId;
	@NotEmpty(message = "Category title should not be empty.")
	private String categoryTitle;
	
	@Size(min = 10, max = 100, message = "Category description length should lies between 10 to 100 characters.")
	private String categoryDescription;

}
