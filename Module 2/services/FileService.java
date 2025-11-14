package com.blogapp.services;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.web.multipart.MultipartFile;

// Service to handle image upload requests.
public interface FileService {
	
	String uploadImage(String path, MultipartFile file, String postId) throws IOException;
	
	InputStream getResource(String path, String fileName) throws FileNotFoundException;
	
	String uploadUserImage(String path, MultipartFile file, String userID) throws IOException;
	
	InputStream getResourceUser(String path, String fileName) throws FileNotFoundException;

}
