import React, { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const TeachAssistInput = ({ onSend, disabled = false, placeholder = "Type your message here..." }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-white/20 bg-dark-800/50 p-6">
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => !disabled && setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 bg-dark-700/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none resize-none text-white placeholder-gray-400 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            rows="1"
            maxLength={500}
          />
          <div className="absolute bottom-1 right-1 text-xs text-gray-400">
            {message.length}/500
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-6 py-3 bg-neon-blue text-white rounded-lg hover:bg-neon-blue/80 focus:ring-2 focus:ring-neon-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default TeachAssistInput; 