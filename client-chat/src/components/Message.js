import React from 'react';
import { Paperclip } from 'lucide-react';

const Message = ({ text, sender, fileUrl, fileName, isImage }) => {
  const isUser = sender === 'You';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-1`}>
      <div
        className={`p-3 max-w-xs md:max-w-md lg:max-w-lg rounded-lg shadow text-white break-words ${
          isUser ? 'bg-indigo-500' : 'bg-gray-500'
        }`}
      >
        {/* File rendering */}
        {fileUrl && (
          <div className="mb-2">
            {isImage ? (
              <img
                src={fileUrl}
                alt={fileName}
                className="rounded-md max-w-full max-h-48 object-cover mb-1"
              />
            ) : (
              <a
                href={fileUrl}
                download={fileName}
                className="flex items-center text-sm underline hover:text-gray-300"
              >
                <Paperclip size={16} className="mr-1" />
                {fileName}
              </a>
            )}
          </div>
        )}

        {/* Emoji-compatible text */}
        <span className="text-sm whitespace-pre-wrap">{text}</span>
      </div>
    </div>
  );
};

export default Message;
