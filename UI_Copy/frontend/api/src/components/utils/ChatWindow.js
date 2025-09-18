import React, { useEffect, useRef } from 'react';
import { UserIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const ChatWindow = ({ chatHistory, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to format Tech Assist messages with proper styling
  const formatMessage = (messageText, sender) => {
    if (sender === 'user') {
      return <div className="whitespace-pre-wrap">{messageText}</div>;
    }

    // Split the message into paragraphs and lines for better processing
    const paragraphs = messageText.split('\n\n');
    
    return (
      <div className="space-y-4 leading-relaxed">
        {paragraphs.map((paragraph, pIndex) => {
          const lines = paragraph.split('\n');
          
          return (
            <div key={pIndex} className="space-y-2">
              {lines.map((line, lIndex) => {
                // Check if line is a numbered step (starts with number.)
                const numberedStepMatch = line.match(/^(\d+)\.\s\*\*(.*?)\*\*:\s*(.*)$/);
                const simpleNumberedMatch = line.match(/^(\d+)\.\s(.*)$/);
                
                if (numberedStepMatch) {
                  const [, stepNumber, title, description] = numberedStepMatch;
                  return (
                    <div key={lIndex} className="flex items-start space-x-3 mb-3">
                      <span className="bg-neon-blue text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">
                        {stepNumber}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-white mb-1">{title}:</div>
                        <div className="text-gray-300">
                          {formatInlineText(description)}
                        </div>
                      </div>
                    </div>
                  );
                } else if (simpleNumberedMatch) {
                  const [, stepNumber, content] = simpleNumberedMatch;
                  return (
                    <div key={lIndex} className="flex items-start space-x-3 mb-3">
                      <span className="bg-neon-blue text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">
                        {stepNumber}
                      </span>
                      <div className="flex-1 text-gray-300">
                        {formatInlineText(content)}
                      </div>
                    </div>
                  );
                } else if (line.trim()) {
                  // Regular paragraph text
                  return (
                    <div key={lIndex} className="text-gray-300">
                      {formatInlineText(line)}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper function to format inline text (bold, code, etc.)
  const formatInlineText = (text) => {
    // Split by backticks to handle code blocks
    const parts = text.split(/(`[^`]+`)/);
    
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        // Code block
        const code = part.slice(1, -1);
        return (
          <code key={index} className="bg-dark-600 px-2 py-1 rounded text-neon-green font-mono text-sm">
            {code}
          </code>
        );
      } else {
        // Regular text that might contain bold formatting
        const boldParts = part.split(/(\*\*[^*]+\*\*)/);
        return boldParts.map((boldPart, boldIndex) => {
          if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            return (
              <strong key={`${index}-${boldIndex}`} className="text-white font-semibold">
                {boldPart.slice(2, -2)}
              </strong>
            );
          }
          return boldPart;
        });
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-800/30 border-t border-white/20">
      {chatHistory.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />
          <p>Start a conversation with Tech Assist</p>
        </div>
      ) : (
        chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-sm lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {message.sender === 'user' ? (
                  <UserIcon className="w-5 h-5" />
                ) : (
                  <ComputerDesktopIcon className="w-5 h-5" />
                )}
              </div>
              
              {/* Message bubble */}
              <div className={`rounded-lg px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-neon-blue text-white'
                  : 'bg-dark-700/50 text-white border border-white/20'
              }`}>
                <div className="text-sm">
                  {formatMessage(message.text, message.sender)}
                </div>
                <p className={`text-xs mt-3 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
            <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
              <ComputerDesktopIcon className="w-5 h-5" />
            </div>
            <div className="bg-dark-700/50 border border-white/20 rounded-lg px-3 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow; 