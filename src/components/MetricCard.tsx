import React, { useState } from "react";

interface MetricCardProps {
  username: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);

  if (!username) return null;

  const metricsURL = `https://metrics.lecoq.io/${username}`;

  return (
    <div className="w-full flex flex-col items-center p-4">
      {loading && <p className="text-gray-500 mb-2">Loading metrics...</p>}
      <iframe
        src={metricsURL}
        width="100%"
        height="400"
        frameBorder="0"
        title="GitHub Metrics"
        className="rounded-lg shadow-md"
        onLoad={() => setLoading(false)}
      ></iframe>
    </div>
  );
};

export default MetricCard;
