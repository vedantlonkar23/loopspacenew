import { uploadCloud } from "../lib/cloudinary.js";
import Event from "../models/Event.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const { title, description, eventCode } = req.body;
        if (eventCode) {
            let event = await Event.findOne({ eventCode: eventCode });
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
        }
        const file = req.file;

        const media = [];
        if (file) {
            const uploadResult = await uploadCloud(req.file.buffer, "posts");
            if (!uploadResult.success) {
                return res.status(500).json({ message: "Failed to upload profile picture" });
            }
            media.push(uploadResult.link);
        }

        const post = new Post({
            user:userId,
            title,
            description,
            media,
            eventCode,
        });

        await post.save();
        user.posts.push(post._id);
        await user.save();
        res.json({ message: "Post created successfully", post });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", "name profilePic _id")
            .populate("comments.user", "name profilePic _id");

        const newposts = posts.map((post) => ({
            ...post._doc,
            isLiked: post.likes.includes(req.user.id),
        }));

        res.json(newposts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


export const likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: "Post already liked" });
        }

        post.likes.push(userId);
        await post.save();
        res.json({ message: "Post liked successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const unlikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: "Post not liked" });
        }
        post.likes = post.likes.filter((id) => id.toString() !== userId);
        await post.save();
        res.json({ message: "Post unliked successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const { text } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({ user: userId, text });
        await post.save();
        res.json({ message: "Comment added successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const commentId = req.params.commentId;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.find((comment) => comment.id === commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user !== userId) {
            return res.status(403).json({ message: "Not authorized to delete comment" });
        }

        post.comments = post.comments.filter((comment) => comment.id !== commentId);
        await post.save();
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const posts = await Post.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("user", "name profilePic _id")
            .populate("comments.user", "name profilePic _id");

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};