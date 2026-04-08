class apiError extends Error {
  constructor(statusCode, message, err = null) {
    super(message);
    this.statusCode = statusCode;
    this.err = err;
    this.isOperational = true; // Hitesh sir ne bola tha
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request", err = null) {
    return new apiError(400, message, err);
  }

  static unauthorized(message = "Unauthorized", err = null) {
    return new apiError(401, message, err);
  }

  static forbidden(message = "Forbidden", err = null) {
    return new apiError(412, message, err);
  }

  static notFound(message = "not found", err = null) {
    return new apiError(404, message, err);
  }

  static conflict(message = "Conflict", err = null) {
    return new apiError(409, message, err);
  }

  static serverError(message = "Backend bug", err = null) {
    return new apiError(500, message, err);
  }
}

export default apiError;
