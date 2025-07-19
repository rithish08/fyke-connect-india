import React, { useState } from "react";

interface WorkerCardProps {
  worker: {
    id: string;
    name: string;
    profile_photo?: string;
    category?: string;
    subcategory?: string;
    rating?: number;
    hourly_rate?: number;
    distance?: string;
    availability?: string;
  };
  onRequest?: () => void;
  onMessage?: () => void;
  requestState?: "none" | "requested";
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker, onRequest, onMessage, requestState = "none" }) => {
  const [isRequested, setIsRequested] = useState(requestState === "requested");

  return (
    <div className="bg-white border-2 border-black shadow-lg rounded-lg p-4 max-w-md mx-auto transition-all duration-300 hover:shadow-xl flex items-center" style={{ minWidth: 350 }}>
      {/* Profile Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 mr-4 flex-shrink-0 flex items-center justify-center">
        {worker.profile_photo ? (
          <img src={worker.profile_photo} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">200 × 200</span>
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{worker.name}</h2>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-sm text-gray-600">{worker.category || "Construction"}</span>
              <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">{worker.subcategory || "Mason"}</div>
            </div>
            <div className="flex items-center text-xs text-gray-500 space-x-2 mt-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="ml-1">{worker.rating || 4.8}</span>
              </div>
              <span className="text-green-500 font-bold">₹{worker.hourly_rate || 350}/hr</span>
              <span className="text-xs text-gray-500">{worker.distance || "1.2km"}</span>
            </div>
          </div>
          {/* Right Section: Availability + Request Button */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="flex items-center space-x-1 text-xs text-gray-600 self-end mb-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Available</span>
            </div>
            <button
              className={`bg-green-500 text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 ${isRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}
              onClick={() => {
                setIsRequested(true);
                onRequest && onRequest();
              }}
              disabled={isRequested}
            >
              {isRequested ? "Requested" : "Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
