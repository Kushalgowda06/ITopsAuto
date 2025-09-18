import React from 'react';

const TypingDotsStyle = () => {
  return (
    <style>
      {`
        @keyframes typing-dots {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
        
        .typing-dot {
          animation: typing-dots 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0;
        }
      `}
    </style>
  );
};

export default TypingDotsStyle; 