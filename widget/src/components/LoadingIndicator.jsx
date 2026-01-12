import React from 'react';
import './LoadingIndicator.css';

const LoadingIndicator = () => {
  return (
    <div className="vet-chat-loading">
      <div className="vet-chat-loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
