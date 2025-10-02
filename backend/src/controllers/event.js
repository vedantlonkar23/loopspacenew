import Event from "../models/Event.js";
import { uploadCloud } from "../lib/cloudinary.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";

export const eventAttended = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { eventCode } = req.body;
        if (!eventCode) {
            return res.status(400).json({ message: "Event code is required" });
        }

        let event = await Event.findOne({ eventCode });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        user.eventsAttended.push(event._id);
        event.attendees.push(user._id);
        await user.save();
        await event.save();

        res.json({ message: "Event attendance recorded successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export const getEvent = async (req, res) => {
    try {
        const { eventCode } = req.params;

        const event = await Event.findOne({ eventCode })
            .populate("attendees")
            .populate("organizer")
            .populate("volunteers").populate("winners");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event);
    } catch (err) {
        console.error("Error fetching event:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getEventsByOrganizer = async (req, res) => {
    try {
        const userId = req.user.id;
        const organizer = await User.findById(userId
        );
        if (!organizer) {
            return res.status(404).json({ message: "User not found" });
        }
        const events = await Event.find({ organizer: userId }).populate("attendees");

        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for this organizer" });
        }

        res.json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

export const createEvent = async (req, res) => {
    try {

        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "organizer") {
            return res.status(403).json({ message: "Only organizers can create events" });
        }
        const {
            name,
            description,
            date,
            startTime,
            endTime,
            location,
            capacity,
            ticketPrice,
            eventType,
            tags,
            skills,
            interests,
            volunteers,
        } = req.body;

        let bannerUrl = null;

        if (req.file) {
            try {
                let data = await uploadCloud(req.file.buffer, "event_banners");
                if (!data.success) {
                    return res.status(500).json({ message: "Failed to upload banner image" });
                }
                bannerUrl = data.link;
            } catch (error) {
                console.error("Error uploading banner:", error);
                return res.status(500).json({ message: "Failed to upload banner image" });
            }
        }

        const eventCode = await generateEventCode();

        const newEvent = new Event({
            name,
            description,
            organizer: userId,
            date,
            startTime,
            endTime,
            location,
            capacity,
            ticketPrice,
            eventType,
            tags,
            skills,
            interests,
            volunteers,
            eventCode,
            bannerUrl,
            attendees: [],
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const generateEventCode = async function () {
    let code = uuidv4().replace(/-/g, "").substring(0, 6);

    return code;
};

