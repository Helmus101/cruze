import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import ParkingList from './components/ParkingList';
import AddSpotButton from './components/AddSpotButton';
import ReservationPage from './components/ReservationPage';
import RewardsPage from './components/RewardsPage';
import { ParkingSpot } from './types';
import { getDistance } from './utils/distance';

function App() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [reservedSpot, setReservedSpot] = useState<ParkingSpot | null>(null);
  const [rewardsPoints, setRewardsPoints] = useState<number>(0);
  const [showRewards, setShowRewards] = useState<boolean>(false);

  useEffect(() => {
    // Simulating user location in Paris
    setUserLocation([48.8566, 2.3522]);
  }, []);

  useEffect(() => {
    // Simulating fetching parking spots from a server
    const fetchParkingSpots = async () => {
      // In a real application, this would be an API call
      const mockSpots: ParkingSpot[] = [
        { id: 1, latitude: 48.8584, longitude: 2.2945, available: true },
        { id: 2, latitude: 48.8738, longitude: 2.2950, available: true },
        { id: 3, latitude: 48.8619, longitude: 2.3324, available: true },
      ];
      setParkingSpots(mockSpots);
    };

    fetchParkingSpots();
  }, []);

  const handleReservation = (id: number) => {
    const spot = parkingSpots.find(spot => spot.id === id);
    if (spot) {
      setReservedSpot({ ...spot, available: false });
      setParkingSpots(spots =>
        spots.map(s => s.id === id ? { ...s, available: false } : s)
      );
      // In a real application, you would send this update to the server
    }
  };

  const handleUnreserve = () => {
    if (reservedSpot) {
      setParkingSpots(spots =>
        spots.map(s => s.id === reservedSpot.id ? { ...s, available: true } : s)
      );
      setReservedSpot(null);
      // In a real application, you would send this update to the server
    }
  };

  const handleAddSpot = () => {
    if (userLocation) {
      const newSpot: ParkingSpot = {
        id: Date.now(),
        latitude: userLocation[0] + (Math.random() - 0.5) * 0.01,
        longitude: userLocation[1] + (Math.random() - 0.5) * 0.01,
        available: true,
      };
      setParkingSpots([...parkingSpots, newSpot]);
      setRewardsPoints(points => points + 1);
      // In a real application, you would send this new spot to the server
    }
  };

  const handleMarkUnavailable = (id: number) => {
    setParkingSpots(spots =>
      spots.map(s => s.id === id ? { ...s, available: false } : s)
    );
    setRewardsPoints(points => points + 1);
    // In a real application, you would send this update to the server
  };

  const availableSpots = parkingSpots.filter(spot => 
    spot.available && 
    userLocation && 
    getDistance(userLocation[0], userLocation[1], spot.latitude, spot.longitude) <= 10
  );

  if (showRewards) {
    return <RewardsPage points={rewardsPoints} onClose={() => setShowRewards(false)} />;
  }

  if (reservedSpot) {
    return (
      <ReservationPage
        spot={reservedSpot}
        userLocation={userLocation}
        onUnreserve={handleUnreserve}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Parking Spot Reservation</h1>
        <button 
          onClick={() => setShowRewards(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Rewards ({rewardsPoints})
        </button>
      </header>
      <main className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 h-1/2 md:h-full relative">
          <Map parkingSpots={availableSpots} userLocation={userLocation} />
          <AddSpotButton onAddSpot={handleAddSpot} disabled={!userLocation} />
        </div>
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto">
          <ParkingList 
            parkingSpots={availableSpots} 
            onReserve={handleReservation} 
            onMarkUnavailable={handleMarkUnavailable}
          />
        </div>
      </main>
    </div>
  );
}

export default App;