import mongoose from "mongoose";



const eventSchema = new mongoose.Schema(
    {
        eventCode: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: function (v) {
                    return /^[A-Za-z0-9]{6}$/.test(v);
                },
                message: "Event code must be exactly 6 alphanumeric characters (letters and numbers only)",
            },
        },
        name: {
            type: String,
            required: true,
            minlength: 3,
        },
        description: {
            type: String,
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String, // Store in HH:mm format
            required: true,
        },
        endTime: {
            type: String, // Store in HH:mm format
            required: true,
        },
        location: {
            type: String,
        },
        qrCodeUrl: {
            type: String,
        },
        capacity: {
            type: Number,
        },
        ticketPrice: {
            type: Number,
            default: 0, // Assuming free if not provided
        },
        eventType: {
            type: String,
            enum: ["conference", "workshop", "seminar", "networking", "other"],
            required: true,
        },
        tags: [
            {
                type: String,
            },
        ],
        skills: [
            {
                type: String,
            },
        ],
        interests: [
            {
                type: String,
            },
        ],
        attendees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        volunteers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        bannerUrl: {
            type: String,
        },
        winners: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        status: {
            type: String,
            enum: ["draft", "published", "cancelled"],
            default: "draft",
        },
    },
    { timestamps: true }
);


const Event = mongoose.model("Event", eventSchema);

export default Event;
