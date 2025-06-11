// src/App.js
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import GroupChat from './components/GroupChat';
import CallWindow from './components/CallWindow';
import UserProfile from './components/UserProfile';
import Header from './components/Header';

const App = () => {
  const [showCall, setShowCall] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [messages, setMessages] = useState({});

  const dummyUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Full-stack developer, tech enthusiast.',
  };

  const mutualGroups = [
    { id: 'g1', name: 'React Developers', members: ['Alice', 'Bob', 'Charlie'] },
    { id: 'g2', name: 'Open Source Contributors', members: ['Diana', 'John', 'Eve'] },
  ];

  const handleSelect = (item) => {
    setSelectedItem(item);
    if (item.type === 'user') setShowProfile(true);
    else setShowProfile(false);
  };

  const handleSendMessage = (chatId, message) => {
    if (!chatId || !message) return;

    const fullMessage = {
      ...message,
      timestamp: message.timestamp || new Date().toISOString(),
      from: 'me',
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: prev[chatId] ? [...prev[chatId], fullMessage] : [fullMessage],
    }));
  };

  const handleBack = () => setSelectedItem(null);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <Sidebar onSelect={handleSelect} onShowProfile={() => setShowProfile(true)} />
      <div className="flex flex-col flex-1">
        <Header onCall={() => setShowCall(true)} onProfile={() => setShowProfile(true)} />
        {selectedItem ? (
          selectedItem.type === 'group' ? (
            <GroupChat
              group={selectedItem.data}
              messages={messages[selectedItem.data.name] || []}
              onSendMessage={(chatId, msg) => handleSendMessage(chatId, msg)}
              onBack={handleBack}
            />
          ) : (
            <ChatWindow
              selectedItem={selectedItem}
              messages={messages[selectedItem.data.name] || []}
              onSendMessage={(msg) => handleSendMessage(selectedItem.data.name, msg)}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-white text-xl font-semibold">
            Select a chat to start messaging
          </div>
        )}
      </div>
      {showCall && <CallWindow type="audio" onEndCall={() => setShowCall(false)} />}
      {showProfile && selectedItem && selectedItem.type === 'user' && (
        <UserProfile
          user={{ ...dummyUser, ...selectedItem.data }}
          mutualGroups={mutualGroups}
          onClose={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default App;
