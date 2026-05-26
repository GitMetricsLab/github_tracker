import { Camera } from "lucide-react"
import { useState } from "react"

const EditProfileForm = () => {

    const [formData, setFormData] = useState({
        username: "deva",
        email: "deva@gmail.com",
        bio: "Full Stack Developer passionate about Open Source.",
        location: "India",
        github: "deva",
        avatar: "https://i.pravatar.cc/150",
    })

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault()

        console.log(formData)

        // API CALL
    }

    return (
        <div className="min-h-screen bg-black px-4 py-10 text-white">

            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-8">

                    <h1 className="text-4xl font-bold">
                        Edit Profile
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Update your personal information and GitHub details
                    </p>
                </div>

                {/* Form Container */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl"
                >

                    {/* Avatar Section */}
                    <div className="mb-10 flex flex-col items-center border-b border-zinc-800 pb-8">

                        <div className="relative">

                            <img
                                src={formData.avatar}
                                alt="profile"
                                className="h-32 w-32 rounded-full border-4 border-zinc-700 object-cover"
                            />

                            <button
                                type="button"
                                className="absolute bottom-0 right-0 rounded-full bg-orange-500 p-3 transition hover:bg-orange-600"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        <p className="mt-4 text-sm text-zinc-400">
                            Upload a new profile picture
                        </p>
                    </div>

                    {/* Input Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {/* Username */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-400">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-orange-500"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-400">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-orange-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-400">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Your location"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-orange-500"
                            />
                        </div>

                        {/* GitHub */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-400">
                                GitHub Username
                            </label>

                            <input
                                type="text"
                                name="github"
                                value={formData.github}
                                onChange={handleChange}
                                placeholder="GitHub username"
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-orange-500"
                            />
                        </div>

                    </div>

                    {/* Bio */}
                    <div className="mt-6">

                        <label className="mb-2 block text-sm font-medium text-zinc-400">
                            Bio
                        </label>

                        <textarea
                            rows={5}
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Write something about yourself..."
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none transition focus:border-orange-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="mt-10 flex items-center justify-end gap-4">

                        <button
                            type="button"
                            className="rounded-xl border border-zinc-700 px-6 py-3 font-medium transition hover:bg-zinc-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            Save Changes
                        </button>

                    </div>

                </form>
            </div>
        </div>
    )
}

export default EditProfileForm