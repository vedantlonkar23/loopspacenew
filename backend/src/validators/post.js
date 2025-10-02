import { body } from "express-validator";

export const validatePost = [
    body("title")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    body("description")
        .trim()
        .isLength({ min: 5, max: 1000 })
        .withMessage("Description must be between 5 and 1000 characters"),

    body("eventCode")
        .optional()
        .matches(/^[A-Za-z0-9]{6}$/)
        .withMessage("Event code must be exactly 6 alphanumeric characters (letters and numbers only)"),

];

export const validateComment = [
    body("text")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage("Comment must be between 1 and 1000 characters"),

]