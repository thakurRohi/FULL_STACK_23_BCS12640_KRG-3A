package com.blogapp.config;

public class AppConstants {
	
	// Constants used in pagination and sorting
	public static final String PAGE_NUMBER = "0";
	public static final String PAGE_SIZE = "10";
	public static final String SORT_BY = "postId";
	public static final String SORT_TYPE = "asc";
	
	// constants used to set roles to users
	public static final Integer NORMAL_USER = 502;
	public static final Integer ADMIN_USER = 501;
	
	// constants used to return message after sending mail.
	public static final String EMAIL_SUCCESS = "Email sent successfully.";
	public static final String EMAIL_NOT_SUCCESS = "Email not sent successfully.";
	public static final String EMAIL_FAILED = "Failed to send an email.";
	
	// constants used to return message after image upload operation
	public static final String IMAGE_SAVED = "Image saved successfully...";
	public static final String IMAGE_NOT_SAVED = "Image not saved successfully...";
	public static final String IMAGE_DELETED = "Image deleted successfully...";
	public static final String IMAGE_NOT_DELETED = "IMAGE NOT deleted successfully...";
	

}
