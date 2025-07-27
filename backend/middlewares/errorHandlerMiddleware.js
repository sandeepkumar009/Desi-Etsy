import { ApiError } from "../utils/ApiError.js";

// Middleware: Handles all errors and sends a consistent JSON response
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    console.error("UNHANDLED ERROR 💥:", err); 

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
    });
}; 

export default errorHandler;
