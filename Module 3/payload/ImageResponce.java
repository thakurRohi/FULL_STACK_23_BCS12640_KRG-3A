package com.blogapp.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ImageResponce {
	
	private String fileName;
	private String message;

}
