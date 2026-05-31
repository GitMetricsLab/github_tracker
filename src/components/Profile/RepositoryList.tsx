import { Github } from "lucide-react"

interface RepositoryItem {
    name: string;
    html_url: string;
}

interface RepositoryListProps {
    repositories: RepositoryItem[];
}

const RepositoryList = ({ repositories }: RepositoryListProps) => {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6
                        dark:bg-zinc-900 dark:border-zinc-800">

            <h2 className="mb-4 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                Top Repositories
            </h2>

            <div className="space-y-4">

                {repositories.map((repo, index) => (
                    <div
                        key={index}
                        className="rounded-xl bg-white dark:bg-zinc-900 p-4 shadow-xl"
                    >

                        <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {repo.name}
                        </h3>

                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        >
                            <Github className="h-5 w-5" />

                            <span className="text-zinc-700 dark:text-zinc-300">
                                GitHub URL
                            </span>

                        </a>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default RepositoryList