import express, { application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import { connectDb } from "./src/lib/db.js";
import router from "./src/routes/index.js";
import passport from "passport";
import session from "express-session";
import { errorHandler } from "./src/middlewares/errorMiddleware.js";

configDotenv();

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
    res.send("Welcome to loopspace");
});


app.use("/api", router);
app.use(errorHandler);
const start = async () => {
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Error on server startup", error);
    }
};

start();