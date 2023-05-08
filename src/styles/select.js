const styles = {
  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    backgroundColor: "transparent",
    paddingTop: "0",
    marginTop: "0",
    width: "8rem",
    border: "1px solid #ccc",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 2
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "1rem",
    fontWeight: "bold",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "currentColor"
  })
};

export default styles