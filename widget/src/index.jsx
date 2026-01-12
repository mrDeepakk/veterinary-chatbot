import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget';

/**
 * Initialize the chatbot widget
 * Called by the SDK loader
 */
window.VetChatWidget = {
  init: (containerId, sessionId, config) => {
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error('VetChatWidget: Container not found');
      return;
    }

    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatWidget sessionId={sessionId} config={config} />
      </React.StrictMode>
    );
  },
};

export default window.VetChatWidget;
