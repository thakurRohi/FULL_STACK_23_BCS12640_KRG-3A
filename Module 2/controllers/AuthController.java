package com.blogapp.controllers;

import java.util.Date;

import javax.validation.Valid;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blogapp.entities.User;
import com.blogapp.exceptions.InvalidUserDetailsException;
import com.blogapp.exceptions.ResoureceAlreadyExistsException;
import com.blogapp.payload.ForgotPasswordDto;
import com.blogapp.payload.UserDto;
import com.blogapp.payload.UserResponse;
import com.blogapp.security.JwtAuthRequest;
import com.blogapp.security.JwtAuthResponse;
import com.blogapp.security.JwtTokenHelper;
import com.blogapp.services.UserService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	@Autowired
	private JwtTokenHelper jwtTokenHelper;

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserService userService;

	@Autowired
	private ModelMapper mapper;

	// API to login user : Security not applied to this API
	@PostMapping("/login")
	public ResponseEntity<JwtAuthResponse> createToken(@RequestBody JwtAuthRequest request) throws Exception {

		// calling our authenticate method to authenticate user
		this.authenticate(request.getUsername(), request.getPassword());

		// getting user details of autheticated username
		UserDetails userDetails = this.userDetailsService.loadUserByUsername(request.getUsername());

		// generating token for autheticated user
		String token = this.jwtTokenHelper.generateToken(userDetails);

		// creeating JWT response to return from this method
		JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(token, new Date(),
				"" + ((JwtTokenHelper.JWT_TOKEN_VALIDITY * 100) / 60000) + " Mins after token creation",
				this.mapper.map((User) userDetails, UserDto.class));

//		JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(token);

		// returning Jwt response
		return new ResponseEntity<JwtAuthResponse>(jwtAuthResponse, HttpStatus.OK);
	}

	private void authenticate(String username, String password) throws Exception {

		// create authentication token object here
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
				password);

		// this method requires authentication token object
		try {

			this.authenticationManager.authenticate(authenticationToken);
		} catch (BadCredentialsException e) {

			System.out.println("Invalid Credentials..");
//			throw new Exception("Invalid Credentials...");
			throw new InvalidUserDetailsException();
		}

	}

//	-----------------------------------------------------------------------------------------------------------------------------------

	// API to register new user : Security not applied to this API.
	@PostMapping("/register")
	public ResponseEntity<UserDto> registerUser(@Valid @RequestBody UserDto userDto)
			throws ResoureceAlreadyExistsException {
		
		System.out.println(userDto);

		UserDto registeredUser = this.userService.registerNewUser(userDto);

		return new ResponseEntity<UserDto>(registeredUser, HttpStatus.CREATED);
	}

//	-----------------------------------------------------------------------------------------------------------------------------------

	// API to register new admin user : Security not applied to this API.
	@PostMapping("/register-admin")
	public ResponseEntity<UserDto> registerAdminUser(@Valid @RequestBody UserDto userDto) {

		System.out.println(userDto);

		UserDto registeredUser = this.userService.registerNewAdminUser(userDto);

		return new ResponseEntity<UserDto>(registeredUser, HttpStatus.CREATED);
	}

//	-----------------------------------------------------------------------------------------------------------------------------------

	// API to handle forgot password requests
	@PostMapping("/forgot-password")
	public ResponseEntity<UserResponse> forgotPass(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {

		UserDto userDto = this.userService.forgotPasswordTest2(forgotPasswordDto);
		return new ResponseEntity<UserResponse>(new UserResponse(userDto, "Password reset successfully.", true),
				HttpStatus.OK);
	}

}
