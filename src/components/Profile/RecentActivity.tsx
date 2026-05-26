const RecentActivity = () => {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Recent Activity
            </h2>

            <div className="space-y-3">

                <div className="rounded-lg bg-zinc-800 p-4">
                    ✔ Pushed 5 commits
                </div>

                <div className="rounded-lg bg-zinc-800 p-4">
                    ⭐ Starred a repository
                </div>

                <div className="rounded-lg bg-zinc-800 p-4">
                    🔥 Opened a pull request
                </div>

            </div>
        </div>
    )
}

export default RecentActivity