import { useNavigate } from "react-router-dom"

const ProfileHeader = () => {
    const navigate = useNavigate();
    return (
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-700 p-8">

            <h1 className="text-4xl font-bold">
                Track Your GitHub Journey
            </h1>

            <p className="mt-2 text-lg text-orange-100">
                Analyze repositories, commits and coding activity
            </p>

            <button className="mt-5 rounded-lg bg-white px-5 py-2 text-black font-semibold"
                onClick={() => navigate('/track')}
            >
                Connect GitHub
            </button>
        </div>
    )
}

export default ProfileHeader