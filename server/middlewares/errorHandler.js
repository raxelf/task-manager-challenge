const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  let statusCode = 500;
  let errorMessage = "Internal Server Error.";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    errorMessage = err.errors[0].message;
  } else if (err.message === "INVALID_CREDENTIALS") {
    statusCode = 401;
    message = "Invalid email/password";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  res.status(statusCode).json({
    success: false,
    errors: errorMessage,
  });
};

module.exports = errorHandler;
