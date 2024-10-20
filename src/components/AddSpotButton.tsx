import React from 'react';

interface AddSpotButtonProps {
  onAddSpot: () => void;
  disabled: boolean;
}

const AddSpotButton: React.FC<AddSpotButtonProps> = ({ onAddSpot, disabled }) => {
  return (
    <button
      onClick={onAddSpot}
      disabled={disabled}
      className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Add Spot
    </button>
  );
};

export default AddSpotButton;