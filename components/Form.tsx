import { ReactNode, VFC } from "react";

export const Form: VFC<{ children: ReactNode }> = ({ children }) => {
  return (
    <form style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420, margin: "auto" }}>
      {children}
    </form>
  );
}

export const Input: VFC<{
  placeholder?: string;
  onChange: (text: string) => void;
  label: string;
  value: string;
}> = ({ placeholder, onChange, label, value }) => {
  return (
    <div style={{ width: "100%" }}>
      <label>{label}:</label>
      <input placeholder={placeholder} onChange={e => onChange(e.target.value)} value={value}/>
    </div>
  );
}

export const Submit: VFC<{
  onClick: () => void;
  label: string;
}> = ({ onClick, label }) => {
  return (
    <button style={{ width: 120 }} onClick={onClick}>{label}</button>
  )
}
