class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message); // we do this because Error class has its own error.message property and we are going to pass our message to that property
    this.statusCode = statusCode;
  }
}

function errorHandler(err, req, res, next) {
  let error = { ...err };
  error.message = err.message;
  // Log to console for developers
  console.log(err.stack.red);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidatorError") {
    const message = Object.values(err.error).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });

  next();
}

module.exports = errorHandler;
