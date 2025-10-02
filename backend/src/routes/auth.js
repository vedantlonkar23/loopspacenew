import { Router } from "express";
import passport from "passport";
import passportConfig from "../lib/passportConfig.js";
import { googleLogin, login, signup, updateUserProfile, getUserProfile, updateOrganizerProfile, connectUser, getConnections, getProfileOther } from "../controllers/auth.js";
import { loginValidator, signupValidator } from "../validators/auth.js";
import { validateRequest } from "../middlewares/errorMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/imageMiddleware.js";

const router = Router();

router.get("/google", (req, res, next) => {
    const role = req.query.role || "individual";
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: JSON.stringify({ role }),
    })(req, res, next);
}
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    googleLogin
);

router.post("/login", loginValidator, validateRequest, login);
router.post("/signup", signupValidator, validateRequest, signup);
router.get("/user-profile", authMiddleware, getUserProfile);
router.get("/user-profile-other/:userId", authMiddleware, getProfileOther);
router.put("/update-user-profile", authMiddleware, uploadImage.single('profilePic'), updateUserProfile)
router.put("/update-organizer-profile", authMiddleware, uploadImage.single('organizationLogo'), updateOrganizerProfile)
router.post('/connect-user', authMiddleware, connectUser)
router.get('/connections', authMiddleware, getConnections)

export default router;