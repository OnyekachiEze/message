import React from 'react';
import { Video, Phone, X } from 'lucide-react';

const CallWindow = ({ type = 'video', onEndCall }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-[#1F1B2E] rounded-xl p-6 w-[90%] max-w-xl shadow-xl text-white">
        <h2 className="text-lg font-semibold mb-4 capitalize">
          {type} call with John Doe
        </h2>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
            JD
          </div>
          <p className="text-sm text-gray-300">00:12</p>

          <div className="flex gap-4 mt-6">
            {type === 'video' && (
              <button className="bg-[#6949FF] p-3 rounded-full hover:bg-[#5a3be3]">
                <Video size={20} />
              </button>
            )}
            <button
              onClick={onEndCall}
              className="bg-red-600 p-3 rounded-full hover:bg-red-700"
            >
              <X size={20} />
            </button>
            <button className="bg-green-600 p-3 rounded-full hover:bg-green-700">
              <Phone size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallWindow;
