import React, { useState, useEffect } from 'react';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';
import { sendMessage } from '../api/chatAPI';

const ChatWidget = ({ sessionId, config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: `Hello${config?.userName ? ` ${config.userName}` : ''}! 👋\n\nI'm your veterinary assistant. I can help you with:\n• Pet health questions\n• Nutrition and diet advice\n• Vaccination information\n• Appointment booking\n\nHow can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  const handleSendMessage = async (message) => {
    // Add user message to UI immediately
    const userMessage = {
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send to backend
      const response = await sendMessage(sessionId, message, config);

      // Add bot response to UI
      const botMessage = {
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      
      // Show error message in chat
      const errorMessage = {
        sender: 'bot',
        text: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClose={toggleChat}
        />
      )}
    </>
  );
};

export default ChatWidget;
