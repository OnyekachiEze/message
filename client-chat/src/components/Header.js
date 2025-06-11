import React from 'react';

const Header = ({ onCall, onProfile }) => (
  <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
    <h1 className="text-xl font-bold text-[#6949FF]">G-Chat</h1>
    <div className="flex gap-4">
      <button
        onClick={onCall}
        className="text-[#6949FF] hover:text-[#5a3be3] font-semibold"
      >
        Start Call
      </button>
      <button
        onClick={onProfile}
        className="text-[#6949FF] hover:text-[#5a3be3] font-semibold"
      >
        Profile
      </button>
    </div>
  </header>
);

export default Header;
