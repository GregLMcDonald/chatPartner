import React from "react";

const LanguageSelectorTitle = ({
  options = [],
  language,
  onChange = () => {}
}) => (
  <h1 className="text-4xl font-bold mb-4">
    Let's chat in{' '}
    <select
      value={language}
      onChange={onChange}
      className="text-4xl font-bold bg-transparent focus:outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </h1>
);

export default LanguageSelectorTitle;