import React from 'react';
import { Sprout } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-green-50 to-purple-100">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Sprout className="text-green-600 mx-auto" size={48} />
        </div>
        <p className="text-gray-600 font-semibold">Lade World of Gardeners...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;