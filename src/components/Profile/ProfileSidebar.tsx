const ProfileSidebar = () => {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <div className="flex flex-col items-center">

                <img
                    src="https://i.pravatar.cc/150"
                    alt="profile"
                    className="h-28 w-28 rounded-full"
                />

                <h1 className="mt-4 text-2xl font-bold">
                    Deep Patel
                </h1>

                <p className="text-zinc-400">
                    Full Stack Developer
                </p>
            </div>

            <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <p>📍 India</p>
                <p>👥 120 Followers</p>
                <p>📦 42 Repositories</p>
            </div>
        </div>
    )
}

export default ProfileSidebar