// src/components/ChatWindow.js
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Mic, Smile, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const ChatWindow = ({ selectedItem, messages, onSendMessage, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendText = () => {
    if (!inputValue.trim()) return;
    onSendMessage({ type: 'text', text: inputValue.trim() });
    setInputValue('');
  };

  const onEmojiClick = (emojiData) => {
    setInputValue((v) => v + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onSendMessage({ type: 'file', file });
    e.target.value = null;
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const sendAudio = () => {
    if (audioBlob) {
      onSendMessage({ type: 'audio', audioBlob });
      setAudioBlob(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-tl-3xl shadow-lg overflow-hidden">
      <div className="flex items-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow">
        <button onClick={onBack} className="mr-4 p-2 hover:bg-purple-700 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold">{selectedItem.data.name}</h2>
          <p className="text-sm text-purple-200">{selectedItem.data.email}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-4 py-2 rounded-lg shadow ${
              msg.from === 'me' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300 text-black mr-auto'
            }`}
          >
            {msg.type === 'text' && <p>{msg.text}</p>}
            {msg.type === 'file' && (
              msg.file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(msg.file)} alt="img" className="rounded max-w-full" />
              ) : (
                <a href={URL.createObjectURL(msg.file)} download className="underline text-white">
                  {msg.file.name}
                </a>
              )
            )}
            {msg.type === 'audio' && (
              <audio controls src={URL.createObjectURL(msg.audioBlob)} className="w-full" />
            )}
            <span className="block text-[10px] mt-1 text-right opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="relative p-3 bg-white border-t flex items-center space-x-2">
        <button onClick={() => setShowEmojiPicker((v) => !v)} className="p-2 hover:bg-gray-200 rounded-full">
          <Smile size={20} />
        </button>

        <button onClick={() => fileInputRef.current.click()} className="p-2 hover:bg-gray-200 rounded-full">
          <Paperclip size={20} />
        </button>
        <input type="file" hidden ref={fileInputRef} onChange={handleFile} />

        <input
          type="text"
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Type a message…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendText()}
        />

        {audioBlob ? (
          <button onClick={sendAudio} className="bg-green-600 p-2 text-white rounded-full hover:bg-green-700">
            <Send size={20} />
          </button>
        ) : (
          <>
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`p-2 rounded-full hover:bg-gray-200 ${recording ? 'text-red-600' : ''}`}
            >
              <Mic size={20} />
            </button>

            <button
              onClick={sendText}
              className="bg-purple-600 p-2 text-white rounded-full hover:bg-purple-700"
            >
              <Send size={20} />
            </button>
          </>
        )}

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-3 z-50 shadow-lg">
            <EmojiPicker onEmojiClick={onEmojiClick} />
            <button onClick={() => setShowEmojiPicker(false)} className="absolute top-1 right-1 text-gray-600">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
