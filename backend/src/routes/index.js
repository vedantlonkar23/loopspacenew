import { Router } from "express";
import authRouter from "./auth.js";
import postRouter from "./post.js";
import eventRouter from "./event.js"
import searchRouter from "./search.js"

const router = Router();
router.use("/auth", authRouter);
router.use("/post", postRouter);
router.use("/event", eventRouter)
router.use("/search", searchRouter)

export default router;