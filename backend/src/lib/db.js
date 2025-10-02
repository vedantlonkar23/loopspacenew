import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("Error on MongoDB connection", error);
    }
};