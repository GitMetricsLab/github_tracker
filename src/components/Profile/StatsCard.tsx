interface StatsCardProps {
    title: string
    value: string
}

const StatsCard = ({
    title,
    value
}: StatsCardProps) => {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="text-zinc-400">
                {title}
            </h2>

            <p className="mt-4 text-4xl font-bold">
                {value}
            </p>
        </div>
    )
}

export default StatsCard