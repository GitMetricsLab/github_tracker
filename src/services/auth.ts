import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const logoutUser = async (): Promise<void> => {
    try {

        const response = await axios.get(
            `${backendUrl}/api/auth/logout`
        );

        // Safe logging
        if (response.data?.message) {
            console.log(response.data.message);
        }

        // Always cleanup + redirect
        localStorage.clear();

        window.location.href = "/login";

    } catch (error) {

        console.error("Logout failed", error);

    }
};