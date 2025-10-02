import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        console.log("JWT Verification Error:", err.message);

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        } else if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired." });
        } else {
            return res.status(500).json({ message: "Internal Server Error." });
        }
    }
};
