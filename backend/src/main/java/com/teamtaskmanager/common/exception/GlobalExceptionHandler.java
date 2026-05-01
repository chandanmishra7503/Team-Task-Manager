package com.teamtaskmanager.common.exception;

import com.teamtaskmanager.common.api.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
		Map<String, String> fieldErrors = new LinkedHashMap<>();
		for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
			fieldErrors.put(fe.getField(), fe.getDefaultMessage());
		}
		return build(HttpStatus.BAD_REQUEST, "Validation failed", req, fieldErrors);
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ApiError> handleBadRequest(BadRequestException ex, HttpServletRequest req) {
		return build(HttpStatus.BAD_REQUEST, ex.getMessage(), req, null);
	}

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, HttpServletRequest req) {
		return build(HttpStatus.NOT_FOUND, ex.getMessage(), req, null);
	}

	@ExceptionHandler({ForbiddenException.class, AccessDeniedException.class})
	public ResponseEntity<ApiError> handleForbidden(Exception ex, HttpServletRequest req) {
		return build(HttpStatus.FORBIDDEN, ex.getMessage(), req, null);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest req) {
		return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error", req, null);
	}

	private ResponseEntity<ApiError> build(HttpStatus status, String message, HttpServletRequest req, Map<String, String> fieldErrors) {
		ApiError err = new ApiError(
				Instant.now(),
				status.value(),
				status.getReasonPhrase(),
				message,
				req.getRequestURI(),
				fieldErrors
		);
		return ResponseEntity.status(status).body(err);
	}
}

