package com.teamtaskmanager.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
	private final SecretKey key;
	private final long expirationMinutes;

	public JwtService(AppProperties props) {
		byte[] bytes = props.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
		this.key = Keys.hmacShaKeyFor(bytes);
		this.expirationMinutes = props.getJwt().getExpirationMinutes();
	}

	public String generateToken(String subject, Map<String, Object> claims) {
		Instant now = Instant.now();
		Instant exp = now.plus(expirationMinutes, ChronoUnit.MINUTES);
		return Jwts.builder()
				.subject(subject)
				.issuedAt(Date.from(now))
				.expiration(Date.from(exp))
				.claims(claims)
				.signWith(key)
				.compact();
	}

	public Claims parseClaims(String token) {
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}

