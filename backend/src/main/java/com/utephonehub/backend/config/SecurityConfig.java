// src/main/java/com/utephonehub/backend/config/SecurityConfig.java
package com.utephonehub.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context. annotation.Bean;
import org.springframework. context.annotation.Configuration;
import org. springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation. web.builders.HttpSecurity;
import org.springframework.security.config.annotation. web.configuration.EnableWebSecurity;
import org.springframework. security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework. security.config.http.SessionCreationPolicy;
import org. springframework.security.web.SecurityFilterChain;
import org. springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework. web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ CORS MUST BE FIRST - Apply CORS configuration
            .cors(cors -> cors. configurationSource(corsConfigurationSource))
            
            // ✅ Disable CSRF for REST APIs
            .csrf(AbstractHttpConfigurer::disable)
            
            // ✅ Stateless session for JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // ✅ Configure authorization rules
            .authorizeHttpRequests(auth -> auth
                
                // ========================================
                // PUBLIC ENDPOINTS (No Authentication Required)
                // ========================================
                
                // Swagger UI and OpenAPI docs
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**", 
                    "/swagger-ui.html",
                    "/swagger-resources/**",
                    "/webjars/**",
                    "/favicon.ico"
                ).permitAll()
                
                // Authentication endpoints
                .requestMatchers(
                    "/api/v1/auth/**"
                ).permitAll()
                
                // Health check endpoints
                .requestMatchers(
                    "/api/v1/health/**",
                    "/actuator/health"
                ).permitAll()
                
                // Public Order Tracking (Module 07 - Public)
                .requestMatchers(
                    "/api/v1/public/**"
                ).permitAll()
                
                // Payment endpoints (VNPay callbacks)
                .requestMatchers(
                    "/api/payments/**",
                    "/api/v1/payments/**"
                ).permitAll()
                
                // Public product browsing endpoints
                .requestMatchers(
                    "/api/v1/products/**",
                    "/api/v1/categories/**", 
                    "/api/v1/brands/**"
                ).permitAll()
                
                // Promotion endpoints (if public)
                .requestMatchers(
                    "/api/v1/promotions/**"
                ).permitAll()
                
                // ========================================
                // ADMIN ENDPOINTS (Admin Role Required)
                // ========================================
                
                // Admin Order Management (Module 07 - Admin)
                .requestMatchers("/api/v1/admin/orders/**").hasAuthority("ADMIN")
                
                // Other admin endpoints
                . requestMatchers(
                    "/api/v1/admin/users/**",
                    "/api/v1/admin/categories/**",
                    "/api/v1/admin/brands/**",
                    "/api/v1/admin/products/**",
                    "/api/v1/admin/promotions/**",
                    "/api/v1/admin/**"
                ).hasAuthority("ADMIN")
                
                // ========================================
                // AUTHENTICATED ENDPOINTS (Any logged-in user)
                // ========================================
                
                // Customer order management
                .requestMatchers("/api/v1/orders/**").authenticated()
                
                // Shopping cart
                .requestMatchers("/api/v1/cart/**").authenticated()
                
                // User addresses
                .requestMatchers("/api/v1/addresses/**").authenticated()
                
                // User profile
                .requestMatchers("/api/v1/users/**").authenticated()
                
                // Default:  require authentication
                .anyRequest().authenticated()
            )
            
            // ✅ Add JWT filter AFTER CORS
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}