import { ApiError } from "../utils/ApiError.js";

// Middleware: Handles all errors and sends a consistent JSON response
const errorHandler = (err, req, res, next) => {
    // If the error is already an instance of our custom ApiError, use it directly.
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    // For any other type of unexpected error, create a generic 500 Internal Server Error response.
    // This prevents sensitive error details from being exposed to the client.
    console.error("UNHANDLED ERROR 💥:", err); // Log the full error to the console for debugging.

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
    });
}; 

export default errorHandler;
