import { Router } from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js'
import { searchUsers, searchEvents, searchPosts } from '../controllers/search.js'
const router = Router()

router.get("/users", authMiddleware, searchUsers)
router.get("/events", authMiddleware, searchEvents)
router.get("/posts", authMiddleware, searchPosts)

export default router