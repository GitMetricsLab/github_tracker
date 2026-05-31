import { useState, useCallback } from "react";

export const useGitHubRepositories = (
    getOctokit: () => any
) => {

    const [repos, setRepos] = useState([]);

    const [totalStars, setTotalStars] =
        useState(0);

    const [totalForks, setTotalForks] =
        useState(0);

    const [topRepositories, setTopRepositories] =
        useState([]);

    const [languages, setLanguages] =
        useState<Record<string, number>>({});

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const fetchRepositories = useCallback(
        async (username: string) => {

            const octokit = getOctokit();

            if (!octokit || !username) return;

            setLoading(true);
            setError("");

            try {

                const repositories =
                    await octokit.paginate(
                        "GET /users/{username}/repos",
                        {
                            username,
                            per_page: 100,
                            sort: "updated",
                        }
                    );

                setRepos(repositories);

                // TOTAL STARS
                const stars =
                    repositories.reduce(
                        (sum: number, repo: any) =>
                            sum + repo.stargazers_count,
                        0
                    );

                setTotalStars(stars);

                // TOTAL FORKS
                const forks =
                    repositories.reduce(
                        (sum: number, repo: any) =>
                            sum + repo.forks_count,
                        0
                    );

                setTotalForks(forks);

                // TOP REPOSITORIES
                const topRepos =
                    [...repositories]
                        .sort(
                            (a: any, b: any) =>
                                b.stargazers_count -
                                a.stargazers_count
                        )
                        .slice(0, 5);

                setTopRepositories(topRepos);

                // LANGUAGES
                const languageMap:
                    Record<string, number> = {};

                repositories.forEach((repo: any) => {

                    if (!repo.language) return;

                    languageMap[repo.language] =
                        (languageMap[repo.language] || 0) + 1;

                });

                setLanguages(languageMap);

            } catch (err: any) {

                setError(
                    err.message ||
                    "Failed to fetch repositories"
                );

            } finally {

                setLoading(false);

            }

        },
        [getOctokit]
    );

    return {
        repos,
        totalStars,
        totalForks,
        topRepositories,
        languages,
        loading,
        error,
        fetchRepositories,
    };
};