package com.teamtaskmanager.user;

import com.teamtaskmanager.security.CurrentUser;
import com.teamtaskmanager.user.dto.MeResponse;
import com.teamtaskmanager.user.dto.UserSummary;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/me")
	public MeResponse me() {
		User me = CurrentUser.require();
		return new MeResponse(me.getId(), me.getEmail(), me.getRole());
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public List<UserSummary> listAll() {
		return userRepository.findAll().stream()
				.map(u -> new UserSummary(u.getId(), u.getEmail(), u.getRole()))
				.toList();
	}
}

