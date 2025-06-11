import React, { useState } from 'react';

const UserProfile = ({ user, mutualGroups = [], onClose }) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReported, setIsReported] = useState(false);

  const handleBlock = () => {
    if (window.confirm(`Are you sure you want to block ${user.name}?`)) {
      // Simulate backend call here
      setIsBlocked(true);
      alert(`${user.name} has been blocked.`);
      onClose();
    }
  };

  const handleReport = () => {
    if (window.confirm(`Are you sure you want to report ${user.name}?`)) {
      // Simulate backend call here
      setIsReported(true);
      alert(`${user.name} has been reported.`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          aria-label="Close profile"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          &times;
        </button>

        <div className="flex flex-col items-center">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt={`${user.name} profile`}
            className="w-24 h-24 rounded-full object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold mb-1">{user.name}</h2>
          <p className="text-gray-600 mb-2">{user.email}</p>
          {user.bio && (
            <p className="text-center text-gray-700 mb-4 px-4">
              {user.bio}
            </p>
          )}

          {mutualGroups.length > 0 && (
            <div className="w-full mb-6">
              <h3 className="text-lg font-semibold mb-2">Mutual Groups</h3>
              <ul className="list-disc list-inside max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
                {mutualGroups.map((group) => (
                  <li key={group.id} className="text-gray-700">
                    {group.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isBlocked ? (
            <p className="text-red-600 font-semibold">User is blocked.</p>
          ) : isReported ? (
            <p className="text-yellow-600 font-semibold">User has been reported.</p>
          ) : (
            <div className="flex gap-4 w-full justify-center">
              <button
                onClick={handleBlock}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition"
              >
                Block
              </button>
              <button
                onClick={handleReport}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded transition"
              >
                Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
