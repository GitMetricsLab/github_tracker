import { useEffect, useRef, useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../services/auth";
type UserType = {
    id: string,
    username: string,
    email: string,
}

interface UserProps {
    user: UserType,
}
const ProfileDropDown = ({ user }: UserProps) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [avatar, setAvatar] = useState("");

    useEffect(() => {

        try {
            const dashboard =
                JSON.parse(
                    localStorage.getItem(
                        "githubDashboard"
                    ) || "{}"
                );
            setAvatar(
                dashboard.profile?.avatar_url || ""
            );
        } catch (error) {

            console.error(
                "Failed to parse githubDashboard",
                error
            );
            setAvatar("");
        }
    }, []);
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>

            {/* Profile Button */}
            <button
                onClick={() => setOpen(!open)}
                className="text-sm font-semibold px-3 py-1 rounded border border-gray-500 hover:text-gray-300 hover:border-gray-300 transition duration-200
                
                "
            >
                <User className="h-8 w-5" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl z-50
                dark:border-gray-700 dark:bg-gray-900">

                    {/* Top Section */}
                    <div className="border-b border-gray-100 px-5 py-4
                    dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <img
                                src={avatar}
                                alt="profile"
                                className="h-12 w-12 rounded-full"
                            />

                            <div>
                                <h3 className="font-semibold text-gray-800
                                dark:text-white">
                                    {/* Deep Patel */}
                                    {user.username}
                                </h3>

                                <p className="text-sm text-gray-500 
                                dark:text-gray-400">
                                    {/* deep@gmail.com */}
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">

                        <Link
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100
    dark:text-gray-200 dark:hover:bg-gray-800"
                            to={"/me"}
                            onClick={() => setOpen(false)}
                        >
                            <User size={18} />
                            My Profile
                        </Link>

                        <Link
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-100
    dark:text-gray-200 dark:hover:bg-gray-800"
                            to={"/profile/edit"}
                            onClick={() => setOpen(false)}
                        >
                            <Settings size={18} />
                            Edit Profile
                        </Link>

                        <button
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 transition hover:bg-red-50
    dark:hover:bg-red-900/2"
                            onClick={() => {
                                setOpen(false);
                                logoutUser();
                            }}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropDown;