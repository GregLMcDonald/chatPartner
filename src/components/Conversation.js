import React, {useEffect, useRef} from 'react';
import { CircleLoader } from 'react-spinners';

const Conversation = ({ conversation, clearConversation, historyCutoff, loading }) => {
  const conversationEndRef = useRef(null);

  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const renderDottedLine = () => (
    <div
      className="w-full h-2 mt-2 relative"
      style={{ borderTop: '1px dotted gray' }}
    >
      <div
        className="absolute w-1 h-1 bg-gray-100 rounded-full"
        style={{ top: '-3px', left: 'calc(50% - 1px)' }}
      ></div>
    </div>
  );

  const opacityClassForMessage = (idx, nbMessages) => {
    if (nbMessages >= historyCutoff && idx <= (nbMessages - historyCutoff - 1)) {
      return 'opacity-50';
    } else {
      return 'opacity-100';
    }
  }

  return (
    <div className="mb-4 mt-10 flex-grow flex flex-col overflow-auto">
      <div className="flex-grow bg-white p-4 mt-2 rounded-lg shadow-md overflow-auto">
        {conversation.map((msg, idx) => {
          return (
            <div key={idx}>
              <div
                className={`${
                  msg.type === 'utterance' && msg.role === 'user'
                    ? 'bg-green-100 text-green-900'
                    : msg.type === 'error'
                    ? 'bg-red-100 text-red-900'
                    : 'bg-gray-100 text-gray-900'
                } ${
                  opacityClassForMessage(idx, conversation.length)
                } p-2 rounded-lg mb-2 max-w-lg`}
              >
                <span className="block whitespace-pre-wrap">{msg.content}</span>
              </div>
              {(idx === (conversation.length - historyCutoff) - 1) && renderDottedLine()}
            </div>
          );
        })}
        <div className="flex justify-center mt-4">
          <CircleLoader color={'#888'} loading={loading} size={20} />
        </div>
        <div className="mt-8" ref={conversationEndRef} />
      </div>
      <div className="mt-2 flex justify-end items-center">
        <button
          onClick={clearConversation}
          className="text-sm font-semibold text-red-600 hover:text-red-800 focus:outline-none"
        >
          Clear conversation
        </button>
      </div>
      <div className="mt-2 text-center text-xs text-gray-500">{`Only the ${historyCutoff} most recent messages in the conversation are currently used to determine the reply.`}</div>
    </div>
  );
};

export default Conversation;
