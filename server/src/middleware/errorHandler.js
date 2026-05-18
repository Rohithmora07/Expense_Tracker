/**
 * Central Express error handler.
 * Keeps API responses consistent and avoids leaking stack traces in production.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.statusCode || err.status || 500;
  let message =
    err.message || (status === 500 ? 'Internal server error' : 'Error');

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id format';
  }

  if (err.name === 'MulterError') {
    status = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image must be 5 MB or smaller';
    } else {
      message = err.message;
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}
