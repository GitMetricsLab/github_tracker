interface LanguageChartProps {
    languages: Record<string, number>;
}

const LanguageChart = ({ languages }: LanguageChartProps) => {
    const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6
                                        dark:border-zinc-800 dark:bg-zinc-900">

            <h2 className="mb-4 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                Languages Used
            </h2>
            <div className="space-y-4">

                {Object.entries(languages)
                    .map(([language, count]) => {

                        const percentage =
                            Math.round(
                                (count / total) * 100
                            );

                        return (

                            <div key={language} className="rounded-xl shadow-xl border-zinc-200 dark:border-zinc-800 p-2">

                                <div className="mb-1 flex justify-between">

                                    <span className="text-zinc-700 dark:text-zinc-300">
                                        {language}
                                    </span>

                                    <span className="text-zinc-700 dark:text-zinc-300">
                                        {percentage}%
                                    </span>

                                </div>

                                <div className="h-3 rounded-full bg-white dark:bg-zinc-900">

                                    <div
                                        className="h-3 rounded-full bg-blue-500"
                                        style={{
                                            width: `${percentage}%`
                                        }}
                                    />

                                </div>

                            </div>

                        );

                    })}

            </div>
        </div>
    )
}

export default LanguageChart