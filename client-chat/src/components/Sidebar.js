import React, { useState } from 'react';

const Sidebar = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const users = [
    { id: 'u1', name: 'John Doe', status: 'Online' },
    { id: 'u2', name: 'Jane Smith', status: 'Offline' },
    { id: 'u3', name: 'Mark Evans', status: 'Online' },
    { id: 'u4', name: 'Emily White', status: 'Offline' },
  ];

  const [groups, setGroups] = useState([
    { id: 'g1', name: 'Family', members: ['John Doe', 'Jane Smith', 'Emily White'] },
    { id: 'g2', name: 'Work', members: ['Mark Evans', 'John Doe'] },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const createGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) return;
    setGroups(prev => [
      ...prev,
      { id: `g${prev.length + 1}`, name: trimmed, members: [] }
    ]);
    setNewGroupName('');
    setShowNewGroupModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#F7F7F8] border-r border-gray-200 relative">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#6949FF]">Chats</h2>
        <button
          onClick={() => setShowNewGroupModal(true)}
          className="text-sm text-[#6949FF] hover:underline"
        >
          + New Group
        </button>
      </div>

      {/* Search Box */}
      <div className="px-4 py-3">
        <input
          type="text"
          placeholder="Search users or groups..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6949FF] bg-white"
        />
      </div>

      {/* Lists */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Users */}
        <h3 className="mt-4 mb-2 text-sm font-semibold text-gray-500 uppercase">Users</h3>
        {filteredUsers.length ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => onSelect({ type: 'user', data: user })}
              className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-[#ECEBFF] transition cursor-pointer rounded-md"
            >
              <div className="w-10 h-10 bg-[#6949FF] text-white rounded-full flex items-center justify-center font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className={`text-sm ${user.status === 'Online' ? 'text-green-500' : 'text-gray-400'}`}>
                  {user.status}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No users found.</p>
        )}

        {/* Groups */}
        <h3 className="mt-6 mb-2 text-sm font-semibold text-gray-500 uppercase">Groups</h3>
        {filteredGroups.length ? (
          filteredGroups.map(group => (
            <div
              key={group.id}
              onClick={() => onSelect({ type: 'group', data: group })}
              className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-[#ECEBFF] transition cursor-pointer rounded-md"
            >
              <div className="w-10 h-10 bg-[#ff7f50] text-white rounded-full flex items-center justify-center font-semibold">
                {group.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-800">{group.name}</p>
                <p className="text-sm text-gray-500">{group.members.length} members</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No groups available.</p>
        )}
      </div>

      {/* Modal for New Group */}
      {showNewGroupModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6949FF]"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                className="px-4 py-2 rounded bg-[#6949FF] text-white hover:bg-[#5a3be3]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
