import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { uploadCloud } from "../lib/cloudinary.js";
import Event from "../models/Event.js";
import Post from "../models/Post.js";

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

export const googleLogin = async (req, res) => {
    try {
        const token = generateToken(req.user);
        const isProfileComplete = req.user.isProfileComplete;
        const role = req.user.role;
        console.log("Google login successful");
        res.redirect(`${process.env.FRONTEND_URL}/auth/google?token=${token}&isProfileComplete=${isProfileComplete}&role=${role}`);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
            },
            role: user.role,
            isProfileComplete: user.isProfileComplete,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password").populate("eventsAttended posts eventsOrganized");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isSelf = (req.user.id === userId);

        res.status(200).json({
            ...user._doc,
            isSelf,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = generateToken(user);

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "organizer") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { name, bio, skills, interests } = req.body;
        let profilePicUrl = user.profilePic;

        if (req.file) {
            const uploadResult = await uploadCloud(req.file.buffer, "profile_pics");
            if (!uploadResult.success) {
                return res.status(500).json({ message: "Failed to upload profile picture" });
            }
            profilePicUrl = uploadResult.link;
        }

        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.profilePic = profilePicUrl;
        user.skills = skills || user.skills;
        user.interests = interests || user.interests
        user.isProfileComplete = true;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
            },
            role: user.role,
            isProfileComplete: user.isProfileComplete,
        });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const updateOrganizerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role === "individual") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { organizationName, organizationDescription, website, phoneNumber, eventTypes, location } = req.body;
        let organizationLogoUrl = user.organizationLogo;
        if (req.file) {
            const uploadResult = await uploadCloud(req.file.buffer, "organization_logos");
            if (!uploadResult.success) {
                return res.status(500).json({ message: "Failed to upload organization logo" });
            }
            organizationLogoUrl = uploadResult.link;
        }
        user.organizationName = organizationName || user.organizationName;
        user.organizationDescription = organizationDescription || user.organizationDescription;
        user.website = website || user.website;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.eventTypes = eventTypes || user.eventTypes;
        user.location = location || user.location;
        user.organizationLogo = organizationLogoUrl;
        user.isProfileComplete = true;
        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
            },
        });

    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Server Error" });
    }

}

export const connectUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User
            .findById(userId)
            .populate("connections");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { connectionId } = req.body;
        if (!connectionId) {
            return res.status(400).json({ message: "Connection ID is required" });
        }

        if (connectionId === userId) {
            return res.status(400).json({ message: "Cannot connect to self" });
        }

        const connectionUser = await User.findById(connectionId);
        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found" });
        }

        if (user.connections.some(conn => conn.id === connectionId)) {
            return res.status(400).json({ message: "Already connected" });
        }

        user.connections.push(connectionId);
        await user.save();
        connectionUser.connections.push(userId);
        await connectionUser.save();

        res.json({ message: "Connection added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getConnections = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User
            .findById(userId)
            .populate("connections");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user.connections);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getProfileOther = async (req, res) => {
    try {

        const { userId } = req.params;
        console.log(userId);
        const user = await User
            .findById(userId)
            .select("-password")
            .populate("connections")
            .populate("eventsAttended")
            .populate("posts")
            .populate("eventsOrganized");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}