import React, { useState, useRef, useEffect } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form className="vet-chat-input-container" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="vet-chat-input"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
      />
      <button
        type="submit"
        className="vet-chat-send-button"
        disabled={!message.trim() || disabled}
      >
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
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
