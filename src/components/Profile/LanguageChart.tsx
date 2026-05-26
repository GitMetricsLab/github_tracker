const LanguageChart = () => {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-xl font-semibold">
                Languages Used
            </h2>

            <div className="space-y-4">

                <div>
                    <div className="mb-1 flex justify-between">
                        <span>TypeScript</span>
                        <span>40%</span>
                    </div>

                    <div className="h-3 rounded-full bg-zinc-800">
                        <div className="h-3 w-[40%] rounded-full bg-blue-500" />
                    </div>
                </div>

                <div>
                    <div className="mb-1 flex justify-between">
                        <span>JavaScript</span>
                        <span>30%</span>
                    </div>

                    <div className="h-3 rounded-full bg-zinc-800">
                        <div className="h-3 w-[30%] rounded-full bg-yellow-500" />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LanguageChart