import { Router } from 'express'
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { uploadImage } from "../middlewares/imageMiddleware.js"
import { validateComment, validatePost } from '../validators/post.js'
import { commentOnPost, createPost, getFeed, likePost, unlikePost } from '../controllers/post.js'
const router = Router()

router.post("/create-post", authMiddleware, uploadImage.single('media'), validatePost, createPost)
router.get("/feed", authMiddleware, getFeed)
router.post("/like-post/:id", authMiddleware, likePost)
router.post("/comment-post/:id", authMiddleware, validateComment, commentOnPost)
router.delete("/like-post/:id", authMiddleware, unlikePost)

export default router