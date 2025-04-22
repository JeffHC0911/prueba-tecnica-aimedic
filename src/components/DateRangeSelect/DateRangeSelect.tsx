import React from "react";
import styles from "./DateRangeSelect.module.css";

interface DateRangeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className={styles.selectContainer}>
      <label htmlFor="date-range" className={styles.label}>
        Rango de días
      </label>
      <select
        id="date-range"
        value={value}
        onChange={handleChange}
        className={styles.select}
      >
        <option value={1}>1 Día</option>
        <option value={2}>2 Días</option>
        <option value={3}>3 Días</option>
        <option value={6}>6 Días</option>
        <option value={12}>12 Días</option>
        <option value={15}>15 Días</option>
      </select>
    </div>
  );
};