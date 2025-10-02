import { fetchClient } from "@/src/lib/fetchClient";
import { UserProfile } from "@/src/types/user";

export const authApi = {
    login: async (data: { email: string; password: string }) => {
        return fetchClient.post<{
            token: string;
            isProfileComplete: boolean;
            role: string;
        }>("/auth/login", data);
    },
    signup: async (data: {
        email: string;
        password: string;
        name?: string;
        role: string;
    }) => {
        return fetchClient.post<{ token: string }>("/auth/signup", data);
    },
    updateUserProfile: async (data: {
        name?: string;
        bio?: string;
        interests?: string[];
        skills?: string[];
        profilePic?: File;
    }) => {
        return fetchClient.put("/auth/update-user-profile", data);
    },
    userProfile: async () => {
        return fetchClient.get<UserProfile>("/auth/user-profile");
    },
    connectUser: async (connectionId?: string) => {
        return fetchClient.post("/auth/connect-user", { connectionId });
    },
    getConnections: async () => {
        return fetchClient.get<UserProfile[]>("/auth/connections");
    },
    userProfileOther: async (userId?: string) => {
        return fetchClient.get<UserProfile>(
            `/auth/user-profile-other/${userId}`
        );
    },
};
