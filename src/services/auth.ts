import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const logoutUser = async (): Promise<void> => {
    try {
        const response = await axios.get(`${backendUrl}/api/auth/logout`);

        if (response.data) {

            // Remove stored user
            localStorage.removeItem("user");

            // Redirect to login/home
            window.location.href = "/login";

            console.log(response.data.message);
        }
        else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.error("Logout failed", error)
    }
}