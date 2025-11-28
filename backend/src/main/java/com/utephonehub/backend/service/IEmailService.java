package com.utephonehub.backend.service;

/**
 * Interface for Email Service operations
 */
public interface IEmailService {
    
    /**
     * Send verification email to user
     * @param email User email
     * @param fullName User full name
     */
    void sendVerificationEmail(String email, String fullName);
    
    /**
     * Send OTP email for password reset
     * @param email User email
     * @param otp OTP code
     */
    void sendOtpEmail(String email, String otp);
    
    /**
     * Send password reset confirmation email
     * @param email User email
     * @param fullName User full name
     */
    void sendPasswordResetEmail(String email, String fullName);
}
