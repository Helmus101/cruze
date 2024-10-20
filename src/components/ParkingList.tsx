import React from 'react';
import { ParkingSpot } from '../types';
import { getAddressFromCoordinates } from '../utils/mockGeocoder';
import { MapPin, X } from 'lucide-react';

interface ParkingListProps {
  parkingSpots: ParkingSpot[];
  onReserve: (id: number) => void;
  onMarkUnavailable: (id: number) => void;
}

const ParkingList: React.FC<ParkingListProps> = ({ parkingSpots, onReserve, onMarkUnavailable }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-100">Available Parking Spots</h2>
      {parkingSpots.length === 0 ? (
        <p className="p-4 text-gray-500">No available parking spots within 10km.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {parkingSpots.map((spot) => (
            <li key={spot.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex items-center flex-grow">
                  <MapPin className="text-blue-500 mr-2 flex-shrink-0" size={20} />
                  <p className="text-sm text-gray-700 mr-2">
                    {getAddressFromCoordinates(spot.latitude, spot.longitude)}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => onMarkUnavailable(spot.id)}
                    className="text-red-500 hover:text-red-600 mr-2"
                    title="Mark as unavailable"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={() => onReserve(spot.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Reserve
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParkingList;