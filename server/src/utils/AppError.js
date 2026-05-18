/**
 * Operational error with HTTP status (validation, not found, etc.).
 */
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
