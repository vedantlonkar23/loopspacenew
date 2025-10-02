import { body } from 'express-validator'
export const validateEvent = [
    body("name").notEmpty().withMessage("Event name is required").isLength({ min: 3 }).withMessage("Event name must be at least 3 characters long"),
    body("organizer").notEmpty().withMessage("Organizer ID is required").isMongoId().withMessage("Organizer must be a valid MongoDB ID"),
    body("date").notEmpty().withMessage("Event date is required").isISO8601().withMessage("Invalid date format"),
    body("startTime").notEmpty().withMessage("Start time is required").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Start time must be in HH:mm format"),
    body("endTime").notEmpty().withMessage("End time is required").matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("End time must be in HH:mm format"),
    body("eventType").notEmpty().withMessage("Event type is required").isIn(["conference", "workshop", "seminar", "networking", "other"]).withMessage("Invalid event type"),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be a positive number"),
    body("ticketPrice").optional().isFloat({ min: 0 }).withMessage("Ticket price must be a non-negative number"),
    body("qrCodeUrl").optional().isURL().withMessage("Invalid QR code URL"),
    body("bannerUrl").optional().isURL().withMessage("Invalid banner URL"),
    body("tags").optional().isArray().withMessage("Tags must be an array of strings"),
    body("skills").optional().isArray().withMessage("Skills must be an array of strings"),
    body("interests").optional().isArray().withMessage("Interests must be an array of strings"),
    body("volunteers").optional().isArray().withMessage("Volunteers must be an array of valid user IDs"),
];