import { LocationIcon } from "@primer/octicons-react"
import { Files, User2Icon, Users } from "lucide-react"

interface ProfileType {
    name: string
    bio: string
    location: string
    followers: number
    imageUrl: string
}

interface ProfileProps {
    profile: ProfileType
}

const ProfileSidebar = ({ profile }: ProfileProps) => {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6
                        dark:border-zinc-800 dark:bg-zinc-900 shadow-sm transition-colors">

            <div className="flex flex-col">

                {/* <User2Icon className="h-28 w-28 rounded-full" /> */}
                <img src={profile.imageUrl} alt="User Avatar" className="h-52 w-52 rounded-full
                                                                            object-cover border border-zinc-300 dark:border-zinc-700" />

                <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
                    {profile.name}
                </h1>

                <p className="text-zinc-600 text-left mt-2 text-sm dark:text-zinc-400 ">
                    {profile.bio}
                </p>
            </div>

            <div className="mt-6 space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
                <span className="flex gap-2">
                    <LocationIcon className="w-4 h-4" />
                    <p>{profile.location}</p>
                </span>

                <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <p>{profile.followers} followers</p>
                </span>
            </div>
        </div>
    )
}

export default ProfileSidebar