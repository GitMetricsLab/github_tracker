import { GitHubCalendar } from "react-github-calendar";

interface UsernameProps {
    username: string;
}

const calendarTheme = {
    light: [
        "#ebedf0",
        "#9be9a8",
        "#40c463",
        "#30a14e",
        "#216e39",
    ],
    dark: [
        "#161b22",
        "#0e4429",
        "#006d32",
        "#26a641",
        "#39d353",
    ],
};

const ContributionHeatmap = ({
    username
}: UsernameProps) => {

    if (!username) return null;

    const themeMode =
        typeof window !== "undefined"
            ? localStorage.getItem("theme")
            : "light";

    return (

        <div className="rounded-2xl border border-zinc-200 bg-white p-6
                        dark:border-zinc-800 dark:bg-zinc-900">

            <h2 className="mb-4 text-xl font-semibold
                           text-zinc-700 dark:text-zinc-300">

                Contributions

            </h2>

            <div className="calendar-container overflow-x-auto pb-2 flex justify-center">

                <GitHubCalendar
                    username={username}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={14}
                    theme={calendarTheme}
                    colorScheme={
                        themeMode === "dark"
                            ? "dark"
                            : "light"
                    }
                />

            </div>

        </div>

    );
};

export default ContributionHeatmap;