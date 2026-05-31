interface AchievementProps {
    title: string
    description: string
}

const AchievementCard = ({
    title,
    description
}: AchievementProps) => {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

            <h3 className="text-lg font-semibold">
                {title}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
                {description}
            </p>
        </div>
    )
}

export default AchievementCard