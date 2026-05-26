import ContributionHeatmap from "../../components/Profile/ContributionHeatmap"
import LanguageChart from "../../components/Profile/LanguageChart"
import ProfileHeader from "../../components/Profile/ProfileHeader"
import ProfileSidebar from "../../components/Profile/ProfileSidebar"
import RecentActivity from "../../components/Profile/RecentActivity"
import RepositoryList from "../../components/Profile/RepositoryList"
import StatsCard from "../../components/Profile/StatsCard"


const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="grid grid-cols-12 gap-6">

                {/* Sidebar */}
                <div className="col-span-3">
                    <ProfileSidebar />
                </div>

                {/* Main Content */}
                <div className="col-span-9 space-y-6">

                    <ProfileHeader />

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <StatsCard title="Repositories" value="24" />
                        <StatsCard title="Followers" value="120" />
                        <StatsCard title="Stars" value="450" />
                        <StatsCard title="Commits" value="1.2K" />
                    </div>

                    <ContributionHeatmap />

                    <div className="grid grid-cols-2 gap-6">
                        <RepositoryList />
                        <LanguageChart />
                    </div>

                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage