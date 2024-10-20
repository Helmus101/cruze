import React from 'react';
import { Award, X } from 'lucide-react';

interface RewardsPageProps {
  points: number;
  onClose: () => void;
}

const RewardsPage: React.FC<RewardsPageProps> = ({ points, onClose }) => {
  const rewardsEarned = Math.floor(points / 40);
  const pointsToNextReward = 40 - (points % 40);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-yellow-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Rewards</h1>
        <button onClick={onClose} className="text-white">
          <X size={24} />
        </button>
      </header>
      <main className="flex-grow p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <Award className="text-yellow-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Rewards Status</h2>
          </div>
          <p className="text-gray-600 mb-2">Total Points: {points}</p>
          <p className="text-gray-600 mb-4">Rewards Earned: {rewardsEarned}</p>
          <div className="bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-yellow-500 rounded-full h-4" 
              style={{ width: `${(points % 40) / 40 * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {pointsToNextReward} more points until your next reward!
          </p>
          {rewardsEarned > 0 && (
            <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-2">Your Rewards:</h3>
              <ul className="list-disc list-inside text-yellow-700">
                {[...Array(rewardsEarned)].map((_, index) => (
                  <li key={index}>Free parking session (1 hour)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RewardsPage;