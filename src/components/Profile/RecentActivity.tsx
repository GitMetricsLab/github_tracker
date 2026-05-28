import { useState } from "react";
interface ActivityItem {
    id: string;
    type: string;
    repo: {
        name: string;
    };
    created_at: string;
    payload: any;
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

const RecentActivity = ({
    activities
}: RecentActivityProps) => {

    const [showAll, setShowAll] = useState(false);
    const formatActivity = (
        activity: ActivityItem
    ) => {

        switch (activity.type) {

            case "PushEvent":
                return "Pushed commits";

            case "PullRequestEvent":
                return "Opened a pull request";

            case "IssueCommentEvent":
                return "Created an issue";

            case "WatchEvent":
                return "Starred a repository";

            case "ForkEvent":
                return "Forked a repository";

            case "CreateEvent":
                return "Created a repository";

            default:
                return activity.type;
        }
    };

    const visibleActivities = showAll ? activities : activities.slice(0, 3);

    return (

        <div className="rounded-2xl border border-zinc-200 bg-white p-6
                                            dark:bg-zinc-900 dark:border-zinc-800">

            <h2 className="mb-4 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                Recent Activity
            </h2>

            <div className="space-y-4">

                {visibleActivities.map((activity) => (

                    <div
                        key={activity.id}
                        className="rounded-xl bg-white dark:bg-zinc-900 p-4"
                    >

                        <div className="flex items-center justify-between shadow-xl border-zinc-200 dark:border-zinc-800 p-2 rounded-xl">

                            <div>

                                <p className="font-medium text-zinc-700 dark:text-zinc-300">

                                    {formatActivity(activity)}

                                </p>

                                <p className="text-sm text-zinc-400">

                                    {activity.repo.name}

                                </p>

                            </div>

                            <span className="text-xs text-zinc-700 dark:text-zinc-300">

                                {
                                    new Date(
                                        activity.created_at
                                    ).toLocaleDateString()
                                }

                            </span>

                        </div>

                    </div>

                ))}

                {
                    activities.length > 5 && (

                        <button
                            onClick={() =>
                                setShowAll(!showAll)
                            }
                            className="
                mt-4
                w-full
                rounded-lg
                border
                border-zinc-200
                bg-white
                px-4
                py-2
                text-sm
                text-zinc-700
                transition
                hover:bg-zinc-200
                dark:border-zinc-800
                dark:bg-zinc-900
                dark:text-zinc-300
                dark:hover:bg-zinc-700
            "
                        >

                            {showAll
                                ? "Show Less"
                                : "Show More"}

                        </button>
                    )
                }

            </div>

        </div>
    );
};

export default RecentActivity;