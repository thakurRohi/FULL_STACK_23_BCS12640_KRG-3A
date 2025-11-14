package com.blogapp.controllers;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogapp.payload.ApiResponse;
import com.blogapp.payload.CategoryDto;
import com.blogapp.services.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;

	// API to create category
	@PostMapping("/")
	public ResponseEntity<CategoryDto> createCat(@Valid @RequestBody CategoryDto categoryDto) {

		CategoryDto createCategory = this.categoryService.createCategory(categoryDto);
		return new ResponseEntity<CategoryDto>(createCategory, HttpStatus.CREATED);
	}

	// API to update category
	@PutMapping("/{categoryId}")
	public ResponseEntity<CategoryDto> updateCat(@Valid @RequestBody CategoryDto categoryDto,
			@PathVariable("categoryId") Integer cId) {

		CategoryDto updateCategory = this.categoryService.updateCategory(categoryDto, cId);
		return new ResponseEntity<CategoryDto>(updateCategory, HttpStatus.CREATED);
	}

	// API to delete category
	@DeleteMapping("/{categoryId}")
	public ResponseEntity<ApiResponse> deleteCat(@PathVariable("categoryId") Integer cId) {

		this.categoryService.deleteCategory(cId);
		return new ResponseEntity<ApiResponse>(new ApiResponse("Category is deleted successfully.", true),
				HttpStatus.OK);
	}
	
	// API to get single category by ID
	@GetMapping("/{categoryId}")
	public ResponseEntity<CategoryDto> getOneCat(@PathVariable("categoryId") Integer cId) {
		
		CategoryDto categoryDto = this.categoryService.getCategory(cId);
		return new ResponseEntity<CategoryDto>(categoryDto, HttpStatus.OK);
	}
	
	// API to get all the categories 
	@GetMapping("/")
	public ResponseEntity<List<CategoryDto>> geAllCat() {
		
		List<CategoryDto> categories = this.categoryService.getAllCategories();
		return ResponseEntity.ok(categories);
	}

}
