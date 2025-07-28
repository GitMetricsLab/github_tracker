
import React from "react";

function MetricCard({ username="md-jasim123" }) {
    const ProfileUrl = `https://metrics.lecoq.io/${username}`;
    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white shadow-md p-8 rounded-lg text-center">     
            <h2 className="text-2xl font-semibold mb-4">GitHub Metric</h2>
             <p className="mb-4">
                Click the button below to view the Github metrics of <strong>{username}</strong>
             </p>
             <a 
                href={ProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
               >
                View Metrics
             </a>   
        </div>
        </div>
    )
}

export default MetricCard;