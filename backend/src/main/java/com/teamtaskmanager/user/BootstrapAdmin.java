package com.teamtaskmanager.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class BootstrapAdmin implements ApplicationRunner {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final String adminEmail;
	private final String adminPassword;

	public BootstrapAdmin(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			@Value("${BOOTSTRAP_ADMIN_EMAIL:}") String adminEmail,
			@Value("${BOOTSTRAP_ADMIN_PASSWORD:}") String adminPassword
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.adminEmail = adminEmail;
		this.adminPassword = adminPassword;
	}

	@Override
	public void run(ApplicationArguments args) {
		if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
			return;
		}
		if (userRepository.existsByEmailIgnoreCase(adminEmail)) {
			return;
		}
		User admin = new User(adminEmail.trim().toLowerCase(), passwordEncoder.encode(adminPassword), Role.ADMIN);
		userRepository.save(admin);
	}
}

