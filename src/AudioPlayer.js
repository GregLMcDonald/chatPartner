import React from 'react';

const AudioPlayer = ({ audioURL }) => {
  return (
    <div>
      {audioURL && (
        <div>
          {audioURL && (
            <div>
              <p className="font-semibold">Generated Audio Response:</p>
              <audio src={audioURL} controls />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
