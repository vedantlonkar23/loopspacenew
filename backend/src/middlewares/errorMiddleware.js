import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Something went wrong!",
        success: false,
    });
};
