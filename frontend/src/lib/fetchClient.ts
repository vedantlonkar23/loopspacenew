const baseURL: string =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    const data = await response.json();

    if (!response.ok) {
        console.log("API Error:", data);
        throw new ApiError(
            response.status,
            data.message || "An error occurred"
        );
    }

    return data;
};

export const fetchClient = {
    get: async <T>(endpoint: string): Promise<T> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (
            response.status === 401 &&
            !window.location.pathname.includes("/auth")
        ) {
            localStorage.clear();
            window.location.href = "/auth/login";
        }
        return handleResponse<T>(response);
    },

    post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data ? JSON.stringify(data) : undefined,
        });
        if (
            response.status === 401 &&
            !window.location.pathname.includes("/auth")
        ) {
            localStorage.clear();
            window.location.href = "/auth/login";
        }
        return handleResponse<T>(response);
    },

    delete: async <T>(endpoint: string): Promise<T> => {
        const token = localStorage.getItem("token");
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
        if (
            response.status === 401 &&
            !window.location.pathname.includes("/auth")
        ) {
            localStorage.clear();
            window.location.href = "/auth/login";
        }
        return handleResponse<T>(response);
    },

    put: async <T>(endpoint: string, data: unknown): Promise<T> => {
        const token = localStorage.getItem("token");
        console.log(token);
        const response = await fetch(`${baseURL}${endpoint}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        });
        if (
            response.status === 401 
        ) {
            localStorage.clear();
            window.location.href = "/auth/login";
        }
        return handleResponse<T>(response);
    },
};
