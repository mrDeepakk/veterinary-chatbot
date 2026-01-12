import React, { useEffect, useRef } from 'react';
import LoadingIndicator from './LoadingIndicator';
import './MessageList.css';

const MessageList = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const formatMessageText = (text) => {
    // Convert markdown-style bold (**text**) to HTML
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="vet-chat-messages">
      {messages.length === 0 && !isLoading && (
        <div className="vet-chat-empty-state">
          <div className="vet-chat-empty-icon">🐾</div>
          <h3>Welcome to Vet Chat!</h3>
          <p>Ask me anything about pet health, nutrition, vaccinations, and care.</p>
        </div>
      )}
      
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`vet-chat-message ${
            msg.sender === 'user' ? 'vet-chat-message-user' : 'vet-chat-message-bot'
          }`}
        >
          <div className="vet-chat-message-content">
            {formatMessageText(msg.text)}
          </div>
          <div className="vet-chat-message-time">
            {new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
      
      {isLoading && <LoadingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
