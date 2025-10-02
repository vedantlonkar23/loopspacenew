import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { uploadImage } from '../middlewares/imageMiddleware.js'
import { createEvent, eventAttended, getEvent, getEventsByOrganizer } from '../controllers/event.js'
import { validateEvent } from '../validators/event.js'

const router = Router()

router.post("/event-attended", authMiddleware, eventAttended)
router.get("/event/:eventCode", authMiddleware, getEvent)
router.post("/create-event", authMiddleware, uploadImage.single('banner'), validateEvent, createEvent)
router.get("/get-events-organizer", authMiddleware, getEventsByOrganizer)

export default router