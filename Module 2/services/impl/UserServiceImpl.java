package com.blogapp.services.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blogapp.config.AppConstants;
import com.blogapp.entities.Role;
import com.blogapp.entities.User;
import com.blogapp.exceptions.ResourceNotFoundException;
import com.blogapp.payload.ForgotPasswordDto;
import com.blogapp.payload.UserDto;
import com.blogapp.repositories.RoleRepo;
import com.blogapp.repositories.UserRepo;
import com.blogapp.services.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleRepo roleRepo;

	@Override
	public UserDto createUser(UserDto userDto) {

		User user = this.userDtoToUser(userDto);
		User savedUser = this.userRepo.save(user);
		return this.userToUserDto(savedUser);
	}

	@Override
	public UserDto updateeUser(UserDto userDto, Integer userId) {

		User user = this.userRepo.findById(userId)
				.orElseThrow((() -> new ResourceNotFoundException("User", " Id ", userId)));

		user.setName(userDto.getName());
		user.setEmail(userDto.getEmail());
		user.setPassword(userDto.getPassword());
		user.setAbout(userDto.getAbout());
		user.setImageName(userDto.getImageName());

//		User user2 = this.modelMapper.map(userDto, User.class);

		User updatedUser = this.userRepo.save(user);
		return this.userToUserDto(updatedUser);
	}

	@Override
	public UserDto getUserById(Integer userId) {

		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", " Id ", userId));

		return this.userToUserDto(user);
	}

	@Override
	public List<UserDto> getAllUsers() {

		List<User> users = this.userRepo.findAll();

		List<UserDto> userDtos = users.stream().map(user -> this.userToUserDto(user)).collect(Collectors.toList());
		return userDtos;
	}

	@Override
	public void deleteUserById(Integer userId) {

		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "Id", userId));

		this.userRepo.delete(user);

	}

	private User userDtoToUser(UserDto userDro) {

//		User user = new User();

//		user.setId(userDro.getId());
//		user.setName(userDro.getName());
//		user.setEmail(userDro.getEmail());
//		user.setPassword(userDro.getPassword());
//		user.setAbout(userDro.getAbout());

		User user = this.modelMapper.map(userDro, User.class);

		return user;
	}

	private UserDto userToUserDto(User user) {

//		UserDto userDto = new UserDto();
//		
//		userDto.setId(user.getId());
//		userDto.setName(user.getName());
//		userDto.setEmail(user.getEmail());
//		userDto.setPassword(user.getPassword());
//		userDto.setAbout(user.getAbout());

		UserDto userDto = this.modelMapper.map(user, UserDto.class);

		return userDto;
	}

	@Override
	public UserDto registerNewUser(UserDto userDto) {

//		User checkUser = null;
//		checkUser = this.userRepo.findByEmail(userDto.getEmail()).get();
//		System.out.println(checkUser);
//		if(checkUser != null) {
//			throw new ResoureceAlreadyExistsException("User", "email", userDto.getEmail());
//		}

		User user = this.modelMapper.map(userDto, User.class);

		// encoding password of new user
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));

		// getting role to new user : default normal user
		Role role = this.roleRepo.findById(AppConstants.NORMAL_USER)
				.orElseThrow(() -> new ResourceNotFoundException("Role", "ID", AppConstants.NORMAL_USER));

		// setting role to the new normal user
		user.getRoles().add(role);

		// saving new normal user in database using repository
		User savedUser = this.userRepo.save(user);

		return this.modelMapper.map(savedUser, UserDto.class);
	}

	@Override
	public UserDto registerNewAdminUser(UserDto userDto) {

		User user = this.modelMapper.map(userDto, User.class);

		// encoding password
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));

		// getting role for new admin user
		Role role = this.roleRepo.findById(AppConstants.ADMIN_USER)
				.orElseThrow(() -> new ResourceNotFoundException("Role", "ID", AppConstants.ADMIN_USER));

		// setting role to new admin user
		user.getRoles().add(role);

		// saving new admin user in the database using repository
		User savedAdminUser = this.userRepo.save(user);

		return this.modelMapper.map(savedAdminUser, UserDto.class);
	}

//	------------------------------------------------Testing Implementation methods-----------------------------------------------------
//	-----------------------------------------------------------------------------------------------------------------------------------

	@Override
	public UserDto forgotPassword(String username, String newPass) {

		User user = this.userRepo.findByEmail(username)
				.orElseThrow(() -> new ResourceNotFoundException("User", "Username: " + username, 0));

		if (user != null) {
			user.setPassword(this.passwordEncoder.encode(newPass));
		}

		User savedUser = this.userRepo.save(user);

		UserDto userDto = this.modelMapper.map(savedUser, UserDto.class);

		return userDto;
	}

	@Override
	public UserDto forgotPasswordTest2(ForgotPasswordDto forgotPasswordDto) {

		User user = this.userRepo.findByEmail(forgotPasswordDto.getUsername()).orElseThrow(
				() -> new ResourceNotFoundException("User", "Username: " + forgotPasswordDto.getUsername(), 0));

		if (user != null) {
			user.setPassword(this.passwordEncoder.encode(forgotPasswordDto.getNewPassword()));
		}

		User savedUser = this.userRepo.save(user);

		UserDto userDto = this.modelMapper.map(savedUser, UserDto.class);

		return userDto;
	}

}
