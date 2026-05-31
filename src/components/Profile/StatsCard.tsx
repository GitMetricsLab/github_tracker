interface StatsCardProps {
    title: string
    value: number
}

const StatsCard = ({
    title,
    value
}: StatsCardProps) => {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6
                        dark:bg-zinc-900 dark:border-zinc-800">

            <h2 className="text-zinc-700 dark:text-zinc-300">
                {title}
            </h2>

            <p className="mt-4 text-4xl font-bold text-zinc-700 dark:text-zinc-300">
                {value}
            </p>
        </div>
    )
}

export default StatsCard