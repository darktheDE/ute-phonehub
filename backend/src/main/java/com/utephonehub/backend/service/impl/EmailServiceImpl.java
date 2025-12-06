package com.utephonehub.backend.service.impl;

import com.utephonehub.backend.service.IEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements IEmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String email, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Xác thực tài khoản UTE Phone Hub");
            message.setText("Chào " + fullName + ",\n\n" +
                    "Cảm ơn bạn đã đăng ký tài khoản UTE Phone Hub.\n" +
                    "Vui lòng xác thực email của bạn để hoàn tất quá trình đăng ký.\n\n" +
                    "Trân trọng,\n" +
                    "UTE Phone Hub Team");
            mailSender.send(message);
            log.info("Verification email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Không thể gửi email xác thực", e);
        }
    }

    @Override
    public void sendOtpEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Mã OTP đặt lại mật khẩu UTE Phone Hub");
            message.setText("Mã OTP của bạn là: " + otp + "\n\n" +
                    "Mã này sẽ hết hạn trong 5 phút.\n" +
                    "Vui lòng không chia sẻ mã này với bất kỳ ai.\n\n" +
                    "Trân trọng,\n" +
                    "UTE Phone Hub Team");
            mailSender.send(message);
            log.info("OTP email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Không thể gửi email OTP", e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String email, String fullName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Mật khẩu đã được đặt lại - UTE Phone Hub");
            message.setText("Chào " + fullName + ",\n\n" +
                    "Mật khẩu của bạn đã được đặt lại thành công.\n" +
                    "Nếu bạn không thực hiện hành động này, vui lòng liên hệ với chúng tôi ngay lập tức.\n\n" +
                    "Trân trọng,\n" +
                    "UTE Phone Hub Team");
            mailSender.send(message);
            log.info("Password reset email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Không thể gửi email đặt lại mật khẩu", e);
        }
    }
}
