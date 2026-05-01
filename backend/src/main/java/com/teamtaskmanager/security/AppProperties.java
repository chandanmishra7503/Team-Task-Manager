package com.teamtaskmanager.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class AppProperties {
	private final Jwt jwt = new Jwt();
	private final Cors cors = new Cors();

	public Jwt getJwt() {
		return jwt;
	}

	public Cors getCors() {
		return cors;
	}

	public static class Jwt {
		private String secret;
		private long expirationMinutes;

		public String getSecret() {
			return secret;
		}

		public void setSecret(String secret) {
			this.secret = secret;
		}

		public long getExpirationMinutes() {
			return expirationMinutes;
		}

		public void setExpirationMinutes(long expirationMinutes) {
			this.expirationMinutes = expirationMinutes;
		}
	}

	public static class Cors {
		private String allowedOrigins;

		public String getAllowedOrigins() {
			return allowedOrigins;
		}

		public void setAllowedOrigins(String allowedOrigins) {
			this.allowedOrigins = allowedOrigins;
		}
	}
}

