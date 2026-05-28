import { useEffect, useState } from "react"
import ContributionHeatmap from "../../components/Profile/ContributionHeatmap"
import LanguageChart from "../../components/Profile/LanguageChart"
import ProfileHeader from "../../components/Profile/ProfileHeader"
import ProfileSidebar from "../../components/Profile/ProfileSidebar"
import RecentActivity from "../../components/Profile/RecentActivity"
import RepositoryList from "../../components/Profile/RepositoryList"
import StatsCard from "../../components/Profile/StatsCard"


const ProfilePage = () => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        name: "",
        bio: "",
        location: "",
        followers: 0,
        repositories: 0,
        imageUrl: ""
    });

    const [stats, setStats] = useState({
        stars: 0,
        issues: 0,
        pullrequests: 0
    });

    const [topRepos, setTopRepos] = useState([]);
    const [languages, setLanguages] = useState<Record<string, number>>({});
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const dashboard =
            JSON.parse(
                localStorage.getItem(
                    "githubDashboard"
                ) || "{}"
            );
        if (dashboard.profile && dashboard.repositories) {
            setUserInfo({
                username: dashboard.profile.login || "",
                name: dashboard.profile.name || "",
                bio: dashboard.profile.bio || "",
                location: dashboard.profile.location || "",
                followers: dashboard.profile.followers || 0,
                repositories: dashboard.profile.public_repos || 0,
                imageUrl: dashboard.profile.avatar_url || ""
            });
            setStats({
                stars: dashboard.repositories.totalStars || 0,
                issues: dashboard.analytics.totalIssues || 0,
                pullrequests: dashboard.analytics.totalPrs || 0
            });
            setTopRepos(
                dashboard.repositories.topRepositories || [],
            );
            setLanguages(
                dashboard.repositories?.languages || {}
            );
            setActivities(
                dashboard.activities || []
            );
        }
    }, [])
    return (
        <div className="min-h-screen bg-white
            dark:bg-zinc-950
            text-black
            dark:text-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Sidebar */}
                <div className="col-span-12 md:col-span-3">
                    <ProfileSidebar profile={userInfo} />
                </div>

                {/* Main Content */}
                <div className="col-span-12 md:col-span-9 space-y-6">

                    {!userInfo.name && <ProfileHeader />}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard title="Followers" value={userInfo?.followers} />
                        <StatsCard title="Stars" value={stats?.stars} />
                        <StatsCard title="Pull Requests" value={stats?.pullrequests} />
                        <StatsCard title="Issues" value={stats?.issues} />
                    </div>

                    <ContributionHeatmap username={userInfo?.username} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RepositoryList repositories={topRepos} />
                        <LanguageChart languages={languages} />
                    </div>

                    <RecentActivity activities={activities} />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage