import { useState } from "react";

export const useGitHubActivity = (
    getOctokit: () => any
) => {

    const [activities, setActivities] =
        useState([]);

    const fetchActivity = async (
        username: string
    ) => {

        const octokit = getOctokit();

        const response =
            await octokit.request(
                "GET /users/{username}/events",
                {
                    username,
                    per_page: 10,
                }
            );

        setActivities(response.data);
    };

    return {
        activities,
        fetchActivity,
    };
};