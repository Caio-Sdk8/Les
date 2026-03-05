import { UseFormRegisterReturn } from "react-hook-form";

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  label?: string;
  options: Option[];
  error?: string;
  placeholder?: string;
} & UseFormRegisterReturn;

export function Select({
  label,
  options,
  error,
  placeholder = "Selecione uma opção",
  ...register
}: SelectProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && <label>{label}</label>}

      <select {...register}>
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}
