import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Paperclip } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const GroupChat = ({ group: initialGroup, messages, onSendMessage, onBack, currentUser }) => {
  const [group, setGroup] = useState(initialGroup);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send text message
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(group.name, { text: inputValue });
      setInputValue('');
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSendMessage(group.name, { file });
    }
  };

  // Audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch {
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const sendAudio = () => {
    if (audioBlob) {
      onSendMessage(group.name, { audio: audioBlob });
      setAudioBlob(null);
    }
  };

  // Add User Modal Handlers
  const openAddUserModal = () => {
    setNewUser('');
    setShowAddUserModal(true);
  };

  const handleAddUserSubmit = () => {
    const trimmedUser = newUser.trim();
    if (!trimmedUser) {
      alert('Please enter a valid user name or email.');
      return;
    }
    if (group.members.includes(trimmedUser)) {
      alert('User already in group.');
      return;
    }
    setGroup((prevGroup) => ({
      ...prevGroup,
      members: [...prevGroup.members, trimmedUser],
    }));
    setShowAddUserModal(false);
    alert(`${trimmedUser} added to the group.`);
  };

  // Exit Group Handler
  const handleExitGroup = () => {
    if (!currentUser) {
      alert('Current user info not provided.');
      return;
    }
    if (!group.members.includes(currentUser)) {
      alert('You are not part of this group.');
      return;
    }
    if (window.confirm('Are you sure you want to exit the group?')) {
      setGroup((prevGroup) => ({
        ...prevGroup,
        members: prevGroup.members.filter((m) => m !== currentUser),
      }));
      alert('You have exited the group.');
      setShowGroupInfo(false);
      onBack(); // Optional: go back to chat list after exiting
    }
  };

  // Report Group Modal Handlers
  const openReportModal = () => {
    setReportReason('');
    setShowReportModal(true);
  };

  const handleReportSubmit = () => {
    const trimmedReason = reportReason.trim();
    if (!trimmedReason) {
      alert('Please enter a reason to report.');
      return;
    }
    setShowReportModal(false);
    alert('Thank you for reporting this group. Our team will review your report.');
    setShowGroupInfo(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-white rounded-tl-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-purple-700 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold">{group.name}</h2>
          <p className="text-sm">{group.members.length} members</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setShowGroupInfo(!showGroupInfo)}
            className="text-white hover:text-gray-200 font-semibold"
          >
            Group Info
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100" 
        style={{ flexDirection: 'column-reverse' }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-lg shadow ${
              msg.from === currentUser
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-300 text-black self-start mr-auto'
            }`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.file && (
              msg.file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(msg.file)} alt="Sent" className="mt-2 max-w-full rounded" />
              ) : (
                <a href={URL.createObjectURL(msg.file)} download className="text-blue-700 underline mt-2 block">
                  Download File
                </a>
              )
            )}
            {msg.audio && (
              <audio controls className="mt-2">
                <source src={URL.createObjectURL(msg.audio)} type="audio/webm" />
              </audio>
            )}
            <span className="block text-[10px] mt-1 text-right opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t flex items-center space-x-2">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-xl">😊</button>
        <button onClick={() => fileInputRef.current.click()}><Paperclip size={20} /></button>
        <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />

        <input
          type="text"
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button onClick={handleSend} className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">
          Send
        </button>

        {!recording ? (
          <button onClick={startRecording} className="text-purple-600"><Mic /></button>
        ) : (
          <button onClick={stopRecording} className="text-red-600 font-bold">Stop</button>
        )}

        {audioBlob && (
          <button onClick={sendAudio} className="bg-green-500 text-white px-2 py-1 rounded-full ml-2">Send Audio</button>
        )}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-10 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Group Info Sidebar */}
      {showGroupInfo && (
        <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-lg z-50 p-4 border-l flex flex-col">
          <h3 className="text-lg font-bold mb-4">Group Info</h3>
          <p className="font-semibold">Members ({group.members.length}):</p>
          <ul className="mb-4 max-h-40 overflow-y-auto flex-grow">
            {group.members.map((member, i) => (
              <li key={i} className="text-sm py-1 border-b">{member}</li>
            ))}
          </ul>
          <button
            onClick={openAddUserModal}
            className="w-full mb-2 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Add User
          </button>
          <button
            onClick={handleExitGroup}
            className="w-full mb-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Exit Group
          </button>
          <button
            onClick={openReportModal}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Report Group
          </button>
          <button
            onClick={() => setShowGroupInfo(false)}
            className="w-full mt-4 text-gray-500 underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h4 className="text-xl mb-4 font-semibold">Add User to Group</h4>
            <input
              type="text"
              placeholder="Enter username or email"
              className="w-full p-2 border rounded mb-4"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUserSubmit}
                className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Group Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h4 className="text-xl mb-4 font-semibold">Report Group</h4>
            <textarea
              placeholder="Enter reason for reporting"
              className="w-full p-2 border rounded mb-4 resize-none h-24"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
