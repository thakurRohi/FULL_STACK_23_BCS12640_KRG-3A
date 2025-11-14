package com.blogapp.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.blogapp.config.AppConstants;
import com.blogapp.entities.EmailDetails;
import com.blogapp.payload.ApiResponse;
import com.blogapp.services.EmailService;

@RestController
public class EmailController {

	@Autowired
	private EmailService emailService;

	// Sending a simple Email
	@PostMapping("/sendMail")
	public ResponseEntity<ApiResponse> sendMail(@RequestBody EmailDetails details) {
		String status = emailService.sendSimpleMail(details);
		boolean flag;

		if (status.equals(AppConstants.EMAIL_SUCCESS)) {
			flag = true;
		} else {
			flag = false;
		}

		return new ResponseEntity<ApiResponse>(new ApiResponse(status, flag), HttpStatus.OK);
	}

	// Sending email with attachment
	@PostMapping("/sendMailWithAttachment")
	public ResponseEntity<ApiResponse> sendMailWithAttachment(@RequestBody EmailDetails details) {
		String status = emailService.sendMailWithAttachment(details);
		boolean flag;

		if (status.equals(AppConstants.EMAIL_SUCCESS)) {
			flag = true;
		} else {
			flag = false;
		}

		return new ResponseEntity<ApiResponse>(new ApiResponse(status, flag), HttpStatus.OK);
	}

}
