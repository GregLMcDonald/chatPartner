import React, {useEffect, useRef} from 'react';

const Conversation = ({ conversation, clearConversation }) => {
  const conversationEndRef = useRef(null);

  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Conversation:</p>
        <button
          onClick={clearConversation}
          className="text-sm font-semibold text-red-600 hover:text-red-800 focus:outline-none"
        >
          Clear conversation
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md overflow-auto" style={{ maxWidth: '500px', minWidth: '500px', minHeight: '500px', maxHeight: '500px' }}>
        {conversation.map((msg, idx) => {
          return (
            <div
              key={idx}
              className={`${
                msg.type === 'user'
                  ? 'bg-green-100 text-green-900'
                  : msg.type === 'error'
                  ? 'bg-red-100 text-red-900'
                  : 'bg-gray-100 text-gray-900'
              } p-2 rounded-lg mb-2 max-w-lg`}
            >
              <span className="block whitespace-pre-wrap">{msg.text}</span>
            </div>
          );
        })}
        <div ref={conversationEndRef} />
      </div>
    </div>

  );
};

export default Conversation;
