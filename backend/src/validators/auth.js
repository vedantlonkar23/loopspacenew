import { body } from "express-validator";

export const loginValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

export const signupValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email address")
        .normalizeEmail(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

export const userProfileValidator = [
    body("bio")
        .trim()
        .optional()
        .isLength({ max: 200 })
        .withMessage("Bio must be at most 200 characters long"),
    body("skills")
        .isArray()
        .withMessage("Skills must be an array")
        .optional()
        .custom((skills) => skills.every((skill) => typeof skill === "string"))
        .withMessage("Each skill must be a string"),
    body("interests")
        .isArray()
        .withMessage("Interests must be an array")
        .optional()
        .custom((interests) => interests.every((interest) => typeof interest === "string"))
        .withMessage("Each interest must be a string"),
];

export const organizerProfileValidator = [
    body("organizationName")
        .trim()
        .notEmpty()
        .withMessage("Organization name is required"),
    body("website")
        .trim()
        .optional()
        .isURL()
        .withMessage("Invalid URL format for website"),
    body("contactEmail")
        .trim()
        .isEmail()
        .withMessage("Invalid contact email address")
        .normalizeEmail(),
    body("description")
        .trim()
        .optional()
        .isLength({ max: 300 })
        .withMessage("Description must be at most 300 characters long"),
];
