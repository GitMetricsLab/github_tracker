interface EmptyStateProps {
  title: string;
  description?: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-5xl mb-3">📭</div>

      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </p>
      )}
    </div>
  );
}