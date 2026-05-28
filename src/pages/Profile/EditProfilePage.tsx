import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../components/Profile/ProfileSidebar";

const EditProfile = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        bio: "",
        location: "",
        website: "",
        imageUrl: "",
        followers: 0,
        repositories: 0,
    });

    useEffect(() => {

        const dashboard =
            JSON.parse(
                localStorage.getItem(
                    "githubDashboard"
                ) || "{}"
            );

        if (dashboard.profile) {

            setFormData({
                username: dashboard.profile.login || "",
                name: dashboard.profile.name || "",
                bio: dashboard.profile.bio || "",
                location: dashboard.profile.location || "",
                website: dashboard.profile.blog || "",
                imageUrl: dashboard.profile.avatar_url || "",
                followers: dashboard.profile.followers || 0,
                repositories: dashboard.profile.public_repos || 0,
            });

        }

    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement
        >
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSave = () => {

        const dashboard =
            JSON.parse(
                localStorage.getItem(
                    "githubDashboard"
                ) || "{}"
            );

        dashboard.profile = {
            ...dashboard.profile,
            name: formData.name,
            bio: formData.bio,
            location: formData.location,
            blog: formData.website,
            avatar_url: formData.imageUrl,
        };

        localStorage.setItem(
            "githubDashboard",
            JSON.stringify(dashboard)
        );

        navigate("/me");

    };

    return (

        <div className="
            min-h-screen
            bg-white
            dark:bg-zinc-950
            text-black
            dark:text-white
            p-6
            transition-colors
        ">

            <div className="
                grid
                grid-cols-1
                lg:grid-cols-12
                gap-6
            ">

                {/* Preview Section */}
                <div className="lg:col-span-4">

                    <ProfileSidebar
                        profile={formData}
                    />

                </div>

                {/* Edit Form */}
                <div className="lg:col-span-8">

                    <div className="
                        rounded-2xl
                        border
                        border-zinc-200
                        dark:border-zinc-800
                        bg-white
                        dark:bg-zinc-900
                        p-6
                        shadow-sm
                    ">

                        <h1 className="
                            text-2xl
                            font-bold
                            mb-6
                        ">
                            Edit Profile
                        </h1>

                        <div className="space-y-5">

                            {/* Name */}
                            <div>

                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-zinc-300
                                        dark:border-zinc-700
                                        bg-zinc-50
                                        dark:bg-zinc-800
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                            {/* Bio */}
                            <div>

                                <label
                                    htmlFor="bio"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Bio
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-zinc-300
                                        dark:border-zinc-700
                                        bg-zinc-50
                                        dark:bg-zinc-800
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                            {/* Location */}
                            <div>

                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Location
                                </label>

                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-zinc-300
                                        dark:border-zinc-700
                                        bg-zinc-50
                                        dark:bg-zinc-800
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                            {/* Website */}
                            <div>

                                <label
                                    htmlFor="website"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Website
                                </label>

                                <input
                                    id="website"
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-zinc-300
                                        dark:border-zinc-700
                                        bg-zinc-50
                                        dark:bg-zinc-800
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                            {/* Avatar URL */}
                            <div>

                                <label
                                    htmlFor="imageUrl"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Profile Image URL
                                </label>

                                <input
                                    id="imageUrl"
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-zinc-300
                                        dark:border-zinc-700
                                        bg-zinc-50
                                        dark:bg-zinc-800
                                        px-4
                                        py-3
                                        outline-none
                                        focus:ring-2
                                        focus:ring-blue-500
                                    "
                                />

                            </div>

                            {/* Buttons */}
                            <div className="
                                flex
                                items-center
                                gap-4
                                pt-4
                            ">

                                <button
                                    onClick={handleSave}
                                    className="
                                        rounded-xl
                                        bg-blue-600
                                        hover:bg-blue-700
                                        px-6
                                        py-3
                                        font-medium
                                        text-white
                                        transition
                                    "
                                >
                                    Save Changes
                                </button>

                                <button
                                    onClick={() => navigate("/profile")}
                                    className="
                                        rounded-xl
                                        border
                                        border-zinc-300
                                        dark:border-zinc-700
                                        px-6
                                        py-3
                                        font-medium
                                        hover:bg-zinc-100
                                        dark:hover:bg-zinc-800
                                        transition
                                    "
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default EditProfile;