import EditProfileForm from "../../components/Profile/EditProfileForm"

const EditProfilePage = () => {
    return (
        <div className="min-h-screen bg-black p-6 text-white">

            <div className="mx-auto max-w-3xl">

                <h1 className="mb-8 text-4xl font-bold">
                    Edit Profile
                </h1>

                <EditProfileForm />

            </div>
        </div>
    )
}

export default EditProfilePage