export const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    padding: "0.5rem",
    backgroundColor: "#F5F7FA",
    borderRadius: "1rem",
    borderWidth: "2px",
    borderColor: state.isFocused ? "#0071E3" : "transparent",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#0071E3",
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0071E3"
      : state.isFocused
      ? "#F5F7FA"
      : "white",
    color: state.isSelected ? "white" : "#1D1D1F",
    padding: "0.75rem 1rem",
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  }),
};
