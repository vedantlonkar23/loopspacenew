import User from "../models/User.js";
import Event from "../models/Event.js";
import Post from "../models/Post.js";

export const searchUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { query, page = 1, limit = 10 } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }
        const pageNum = Math.max(parseInt(page, 10), 1);
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const filter = { $text: { $search: query } };

        const [users, count] = await Promise.all([
            User.find(filter, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(filter)
        ]);

        res.json({
            total: count,
            page: pageNum,
            limit: limitNum,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const searchEvents = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }
        const pageNum = Math.max(parseInt(page, 10), 1);
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const filter = { $text: { $search: query } };

        const [events, count] = await Promise.all([
            Event.find(filter, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limitNum),
            Event.countDocuments(filter)
        ]);

        res.json({
            total: count,
            page: pageNum,
            limit: limitNum,
            data: events
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const searchPosts = async (req, res) => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }
        const pageNum = Math.max(parseInt(page, 10), 1);
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;

        const filter = { $text: { $search: query } };

        const [posts, count] = await Promise.all([
            Post.find(filter, { score: { $meta: "textScore" } })
                .sort({ score: { $meta: "textScore" } })
                .skip(skip)
                .limit(limitNum).populate("user"),
            Post.countDocuments(filter)
        ]);

        res.json({
            total: count,
            page: pageNum,
            limit: limitNum,
            data: posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
