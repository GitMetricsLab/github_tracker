const ContributionHeatmap = () => {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Contribution Activity
            </h2>

            <div className="flex gap-2">
                {[...Array(50)].map((_, index) => (
                    <div
                        key={index}
                        className="h-8 w-8 rounded bg-green-700"
                    />
                ))}
            </div>
        </div>
    )
}

export default ContributionHeatmap