import React from "react";
import Select from "react-select";
import styles from "../styles/select";

const LanguageSelectorTitle = ({
  options = [],
  language,
  onChange = () => {}
}) => {


  const handleChange = (selectedOption) => {
    onChange(selectedOption.value);
  };

  const selectedOption = options.find((option) => option.value === language);

  return (
    <div className="absolute top-2 left-4">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        styles={styles}
        isSearchable={false}
        components={{
          IndicatorSeparator: null
        }}
      />
    </div>
  );
};

export default LanguageSelectorTitle;
