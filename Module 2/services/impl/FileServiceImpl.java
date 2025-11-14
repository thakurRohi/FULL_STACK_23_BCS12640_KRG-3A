package com.blogapp.services.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.blogapp.services.FileService;

@Service
public class FileServiceImpl implements FileService {
	
//	------------------------------------------------------------------------------------------------------------------------------------
//	-----------------------------------------------Image upload for post----------------------------------------------------------------

	@Override
	public String uploadImage(String path, MultipartFile file, String postId) throws IOException {

		// get file name
		String name = file.getOriginalFilename();

		// random name generation of image while uploading to store in folder.
		String randomId = UUID.randomUUID().toString();
		// String fileName1 = randomId.concat(name.substring(name.lastIndexOf(".")));
		String fileName1 = "POST$" + postId + "-" + randomId.concat(name.substring(name.lastIndexOf(".")));

		// full path of file
		String filePath = path + File.separator + fileName1;

		// create folder if not created
		File f = new File(path);
		if (!f.exists()) {
			f.mkdir();
		}

		// file copy in folder
		Files.copy(file.getInputStream(), Paths.get(filePath));

		return fileName1;
	}

	@Override
	public InputStream getResource(String path, String fileName) throws FileNotFoundException {

		String fullPath = path + File.separator + fileName;
		InputStream is = new FileInputStream(fullPath);
		return is;
	}
	
//	------------------------------------------------------------------------------------------------------------------------------------
//	-----------------------------------------------Image upload for user----------------------------------------------------------------

	@Override
	public String uploadUserImage(String path, MultipartFile file, String userID) throws IOException {

		// get image name;
		String name = file.getOriginalFilename();

		// regenrating random name for image and saving it
		String randomId = UUID.randomUUID().toString();
		String filename = "USER$" + userID + "-" + randomId.concat(name.substring(name.lastIndexOf(".")));
		String filePath = path + File.separator + filename;

		// create folder if not created
		File f = new File(path);
		if (!f.exists()) {
			f.mkdir();
		}

		// file copy in folder
		Files.copy(file.getInputStream(), Paths.get(filePath));

		return filename;
	}

	@Override
	public InputStream getResourceUser(String path, String fileName) throws FileNotFoundException {
		String fullPath = path + File.separator + fileName;
		InputStream is = new FileInputStream(fullPath);
		return is;
	}

}
