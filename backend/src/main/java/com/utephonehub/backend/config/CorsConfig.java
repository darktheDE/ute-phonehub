// src/main/java/com/utephonehub/backend/config/CorsConfig.java
package com.utephonehub.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.Collections;

/**
 * CORS (Cross-Origin Resource Sharing) Configuration Cấu hình CORS toàn diện để
 * fix lỗi Swagger UI và frontend
 */
@Configuration
public class CorsConfig {

	/**
	 * Primary CORS Configuration Source for Spring Security
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();

		// ✅ Allow ALL origins
		configuration.setAllowedOriginPatterns(Collections.singletonList("*"));

		// ✅ Allow ALL HTTP methods
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));

		// ✅ Allow ALL headers
		configuration.setAllowedHeaders(Collections.singletonList("*"));

		// ✅ IMPORTANT: Set to FALSE for public APIs and Swagger
		configuration.setAllowCredentials(false);

		// ✅ Expose headers for frontend consumption
		configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin", "Access-Control-Allow-Methods",
				"Access-Control-Allow-Headers", "Access-Control-Max-Age", "Access-Control-Request-Method",
				"Access-Control-Request-Headers", "Authorization", "Content-Type"));

		// ✅ Cache preflight for 1 hour
		configuration.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return source;
	}

	/**
	 * Secondary CORS Configuration for WebMVC (Double coverage)
	 */
	@Bean
	public WebMvcConfigurer corsWebMvcConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**").allowedOriginPatterns("*")
						.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD").allowedHeaders("*")
						.allowCredentials(false) // FALSE for Swagger compatibility
						.maxAge(3600);
			}
		};
	}
}