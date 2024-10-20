import React from 'react';
import { ParkingSpot } from '../types';
import { getAddressFromCoordinates } from '../utils/mockGeocoder';
import { MapPin, Navigation } from 'lucide-react';

interface ReservationPageProps {
  spot: ParkingSpot;
  userLocation: [number, number] | null;
  onUnreserve: () => void;
}

const ReservationPage: React.FC<ReservationPageProps> = ({ spot, userLocation, onUnreserve }) => {
  const address = getAddressFromCoordinates(spot.latitude, spot.longitude);

  const handleGetDirections = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${spot.latitude},${spot.longitude}`;
      window.open(url, '_blank');
    } else {
      alert('Unable to get your current location. Please enable location services and try again.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">Your Reserved Spot</h1>
      </header>
      <main className="flex-grow p-4">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center mb-4">
            <MapPin className="text-blue-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Reserved Parking Spot</h2>
          </div>
          <p className="text-gray-600 mb-4">{address}</p>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleGetDirections}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
            >
              <Navigation className="mr-2" size={20} />
              Get Directions
            </button>
            <button
              onClick={onUnreserve}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Unreserve Spot
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationPage;