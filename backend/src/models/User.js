import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["individual", "organizer"],
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true // Avoids unique constraint issues when null
        },
        profilePic: {
            type: String
        },
        bio: {
            type: String
        },
        skills: [{
            type: String
        }],
        interests: [{
            type: String
        }],
        eventsAttended: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Event'
        }],
        posts: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Post'
        }],
        isProfileComplete: {
            type: Boolean,
            default: false
        },

        // Organizer-specific fields (only used when role = "organizer")
        organizationName: {
            type: String,
            sparse: true
        },
        organizationDescription: {
            type: String,
            sparse: true
        },
        website: {
            type: String,
            sparse: true
        },
        phoneNumber: {
            type: String,
            sparse: true
        },
        eventTypes: [{
            type: String
        }],
        location: {
            type: String,
            sparse: true
        },
        organizationLogo: {
            type: String,
            sparse: true
        },
        eventsOrganized: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Event'
        }],
        connections: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'User'
            }
        ]
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);
export default User;
