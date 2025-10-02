export type UserProfile = {
    _id: string;
    role: "individual" | "organizer";
    name: string;
    email: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
    profilePic?: string;
    eventsAttended?: Event[]; // For individuals
    posts?: Post[]; // For individuals
    isProfileComplete: boolean;

    // Organizer-specific fields (optional)
    organizationName?: string;
    organizationDescription?: string;
    website?: string;
    phoneNumber?: string;
    eventTypes?: string[];
    location?: string;
    organizationLogo?: string;
    eventsOrganized?: string[]; // For organizers

    connections?: string[];
    isSelf: boolean;
};

export type Post = {
    _id: string;
    user: {
        _id: string;
        name: string;
        profilePic: string;
    };
    title: string;
    description: string;
    media?: string[];
    likes: string[];
    comments: {
        text: string;
        user: {
            _id: string;
            name: string;
            profilePic: string;
        };
        createdAt: Date;
    }[];
    eventCode?: string;
    createdAt: Date;
    updatedAt: Date;
    isLiked?: boolean;
};

export type Event = {
    _id: string;
    eventCode: string;
    name: string;
    description?: string;
    organizer: UserProfile;
    date: Date;
    startTime: string;
    endTime: string;
    location?: string;
    qrCodeUrl?: string;
    capacity?: number;
    ticketPrice?: number;
    eventType: "conference" | "workshop" | "seminar" | "networking" | "other";
    tags?: string[];
    skills?: string[];
    interests?: string[];
    attendees: UserProfile[];
    volunteers?: UserProfile[];
    bannerUrl?: string;
    winners?: UserProfile[];
    createdAt: Date;
    updatedAt: Date;
    status: "draft" | "published" | "cancelled";
};

export type Organizer = {
    _id: string;
    name: string;
    profilePic: string;
};
