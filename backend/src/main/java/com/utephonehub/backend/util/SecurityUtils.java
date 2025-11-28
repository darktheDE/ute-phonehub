package com.utephonehub.backend.util;

import com.utephonehub.backend.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Utility class for security-related operations.
 * Provides methods to extract user information from JWT tokens.
 */
@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Extracts the user ID from the Authorization header in the request.
     *
     * @param request the HTTP request containing the Authorization header
     * @return the user ID extracted from the JWT token
     * @throws UnauthorizedException if the token is invalid or missing
     */
    public Long getCurrentUserId(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                return jwtTokenProvider.getUserIdFromToken(token);
            }
        }
        throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
    }

    /**
     * Extracts the JWT token from the Authorization header.
     *
     * @param request the HTTP request containing the Authorization header
     * @return the JWT token string, or null if not present
     */
    public String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * Validates the token and returns the user ID if valid.
     *
     * @param request the HTTP request containing the Authorization header
     * @return the user ID if token is valid, null otherwise
     */
    public Long getUserIdIfAuthenticated(HttpServletRequest request) {
        String token = extractToken(request);
        if (token != null && jwtTokenProvider.validateToken(token)) {
            return jwtTokenProvider.getUserIdFromToken(token);
        }
        return null;
    }
}
