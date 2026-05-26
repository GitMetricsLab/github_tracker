const RepositoryList = () => {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Top Repositories
            </h2>

            <div className="space-y-4">

                <div className="rounded-xl bg-zinc-800 p-4">
                    <h3 className="font-semibold">
                        github-tracker
                    </h3>

                    <p className="text-sm text-zinc-400">
                        Track GitHub activity
                    </p>
                </div>

                <div className="rounded-xl bg-zinc-800 p-4">
                    <h3 className="font-semibold">
                        portfolio
                    </h3>

                    <p className="text-sm text-zinc-400">
                        Personal website
                    </p>
                </div>

            </div>
        </div>
    )
}

export default RepositoryList