package com.blogapp.payload;

import java.util.HashSet;
import java.util.Set;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
//@JsonIgnoreProperties(value = {"password"})  // not to send password field in responce obj.
public class UserDto {
	
	private int id;
	
	@NotEmpty
	@Size(min=2, message = "User's name must be min 2 characters.")
	private String name;
	
	@Email(message = "Email ID is not valid.")
	@NotEmpty(message = "Email should't be empty.")
	private String email;
	
	@NotEmpty(message = "Password shouldn't be empty.")
	@Size(min = 8, max = 20, message = "Password must be min 8 and max 20 characters.")
	private String password;
	
	@NotEmpty
	private String about;
	
	private String imageName;
	
	private Set<RoleDto> roles = new HashSet<RoleDto>();
	
	@JsonIgnore
	public String getPassword() {
		return password;
	}
	
	@JsonProperty
	public void setPassword(String password) {
		this.password = password;
	}

} 
