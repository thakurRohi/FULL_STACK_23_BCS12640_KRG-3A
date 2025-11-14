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
import org.springframework.security.access.prepost.PreAuthorize;
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
import com.blogapp.exceptions.ResoureceAlreadyExistsException;
import com.blogapp.payload.ApiResponse;
import com.blogapp.payload.UserDto;
import com.blogapp.payload.UserResponse;
import com.blogapp.services.FileService;
import com.blogapp.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@Autowired
	private FileService fileService;

	@Value("${project.image}")
	private String path;
	
//	-----------------------------------------------------------------------------------------------------------------------------------
	
	@PostMapping("/reg-user")
	public ResponseEntity<UserDto> createUserNormalRole(@Valid @RequestBody UserDto userDto) throws ResoureceAlreadyExistsException{
		
		UserDto registerNewUser = this.userService.registerNewUser(userDto);
		return new ResponseEntity<UserDto>(registerNewUser, HttpStatus.CREATED);
	}
	
//	-----------------------------------------------------------------------------------------------------------------------------------

	@PostMapping("/")
	public ResponseEntity<UserDto> createUser(@Valid @RequestBody UserDto userDto) {

		UserDto createdUserDto = this.userService.createUser(userDto);
		return new ResponseEntity<>(createdUserDto, HttpStatus.CREATED);

	}

	@PutMapping("/{userId}")
	public ResponseEntity<UserDto> updateUser(@Valid @RequestBody UserDto userDto,
			@PathVariable("userId") Integer uId) {

		UserDto updatedUser = this.userService.updateeUser(userDto, uId);
		return ResponseEntity.ok(updatedUser);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{userId}")
	public ResponseEntity<ApiResponse> deleteUser(@PathVariable("userId") Integer uId) {

		this.userService.deleteUserById(uId);
		// return new ResponseEntity<>(Map.of("message", "User deleted
		// successfully..."), HttpStatus.OK);
		return new ResponseEntity<ApiResponse>(new ApiResponse("User deleted successfully...", true), HttpStatus.OK);
	}

	@GetMapping("/")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		return ResponseEntity.ok(this.userService.getAllUsers());
	}
	

	@GetMapping("/{userId}")
	public ResponseEntity<UserDto> getUser(@PathVariable("userId") Integer uid) {
		return ResponseEntity.ok(this.userService.getUserById(uid));
	}

//	-----------------------------------------------------------------------------------------------------------------------------------
//	------------------------------------------------------User Image Upload API--------------------------------------------------------
//  -----------------------------------------------------------------------------------------------------------------------------------
	// API to update and save image of an user
	@PostMapping("/user/image/upload/{userId}")
	public ResponseEntity<UserResponse> uploadImage(@RequestParam("image") MultipartFile image,
			@PathVariable("userId") Integer userID) throws IOException, AlreadyExistsException {

		UserDto currentUser = this.userService.getUserById(userID);
		String fileName = null;
		File file = null;

		// Condition 1 : Set image for new post
		// and store it in folder.
		if (currentUser.getImageName() == null || currentUser.getImageName().equals("")) {

			fileName = this.fileService.uploadUserImage(path, image, Integer.toString(userID));

			currentUser.setImageName(fileName);
			UserDto userDtoUpdated = this.userService.updateeUser(currentUser, userID);
			System.out.println(AppConstants.IMAGE_SAVED);

			return new ResponseEntity<UserResponse>(new UserResponse(userDtoUpdated, AppConstants.IMAGE_SAVED, true),
					HttpStatus.OK);
		}

		// Condition 2 : If image already exists then delete it from
		// the folder and update it with new image.
		if(currentUser.getImageName() != null || currentUser.getImageName() != "") {
			try {
				file = new File(path + File.separator + currentUser.getImageName());
				if(file.delete()) {
					System.out.println(AppConstants.IMAGE_DELETED);
					fileName = this.fileService.uploadUserImage(path, image, Integer.toString(userID));
					System.out.println("Existing image deleted successfully...\nSaving new image...\nSaved successfully !!");
				}
				else {
					System.out.println(AppConstants.IMAGE_NOT_DELETED);
					throw new AlreadyExistsException(AppConstants.IMAGE_NOT_DELETED + " : unable to delete..");
				}
			} catch (Exception e) {
				System.out.println(AppConstants.IMAGE_NOT_DELETED + " : Failed to delete..");
				throw new AlreadyExistsException(AppConstants.IMAGE_NOT_DELETED + " : Failed to delete..");
			}
		}
		
		currentUser.setImageName(fileName);
		UserDto updateeUserDto = this.userService.updateeUser(currentUser, userID);

		return new ResponseEntity<UserResponse>(new UserResponse(updateeUserDto, AppConstants.IMAGE_SAVED, true),
				HttpStatus.OK);
	}
	
    // --------------------------------------------------------------------------------------------------------------------------------
	
	// API to retrieve image from folder.
	@GetMapping(value = "user/image/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
	public void downlaodImage(@PathVariable("imageName") String imageaName, HttpServletResponse response)
			throws IOException {

		InputStream resource = this.fileService.getResourceUser(path, imageaName);

		response.setContentType(MediaType.IMAGE_JPEG_VALUE);
		StreamUtils.copy(resource, response.getOutputStream());

	}

//	-----------------------------------------------------Testing API's------------------------------------------------------------------
//	------------------------------------------------------------------------------------------------------------------------------------

	@PostMapping("/forgot-pass/{username}/{newPass}")
	public ResponseEntity<UserResponse> forgotPassword(@PathVariable("username") String username,
			@PathVariable("newPass") String newPass) {

		UserDto userDto = this.userService.forgotPassword(username, newPass);
		return new ResponseEntity<UserResponse>(new UserResponse(userDto, "New password set successfully...", true),
				HttpStatus.OK);

	}

}
