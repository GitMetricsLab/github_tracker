import ActivityFeed from "../components/ActivityFeed";
export default function Activity() {
  return (
    <div className="w-full h-full pt-24 p-6 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Live GitHub Activity
        </h1>

        <ActivityFeed username="octocat" />
      </div>
    </div>
  );
}