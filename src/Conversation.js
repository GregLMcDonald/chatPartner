import React from 'react';

const Conversation = ({ conversation }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-auto" style={{ maxWidth: '500px', minWidth: '500px', minHeight: '500px', maxHeight: '500px' }}>
      {conversation.map((msg, idx) => {
        const isUser = msg.type === 'user';
        const messageClassName = isUser ? 'bg-green-100' : 'bg-gray-100';
        return (
          <div key={idx} className={`p-2 rounded-lg mb-2 ${messageClassName}`}>
            <span className="block whitespace-pre-wrap">{msg.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Conversation;
