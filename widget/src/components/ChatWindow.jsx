import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatWindow.css';

const ChatWindow = ({ messages, isLoading, onSendMessage, onClose }) => {
  return (
    <div className="vet-chat-window">
      <div className="vet-chat-header">
        <div className="vet-chat-header-info">
          <div className="vet-chat-header-avatar">🐾</div>
          <div>
            <div className="vet-chat-header-title">Vet Assistant</div>
            <div className="vet-chat-header-status">
              <span className="vet-chat-status-dot"></span>
              Online
            </div>
          </div>
        </div>
        <button className="vet-chat-close-button" onClick={onClose} aria-label="Close chat">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <MessageList messages={messages} isLoading={isLoading} />
      
      <MessageInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;
