import React from "react";

const VoiceSelectorHeading = ({
  options = [],
  voiceName,
  onChange = () => {},
  allowSelect = false
}) => (
  <h2 className="text-xl italic mb-8">
    I'll answer in the{' '}
    {allowSelect ? (
      <select
      value={voiceName}
      onChange={onChange}
      disabled
      className="text-2xl font-bold bg-transparent focus:outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>)
    : voiceName
  }
  {' '} voice.
  </h2>
);

export default VoiceSelectorHeading;