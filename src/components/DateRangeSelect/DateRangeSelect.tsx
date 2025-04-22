import React from "react";
import styles from "./DateRangeSelect.module.css";

interface DateRangeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export const DateRangeSelect: React.FC<DateRangeSelectProps> = ({ value, onChange }) => {

    /**
     * 
     * @param event Evento de cambio del select
     * @description Maneja el cambio de valor del select y llama a la función onChange con el nuevo valor.
     * @returns {void}
     */
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
        <option value={1}>2 Día</option>
        <option value={2}>3 Días</option>
        <option value={3}>4 Días</option>
        <option value={6}>7 Días</option>
        <option value={12}>12 Días</option>
        <option value={15}>15 Días</option>
      </select>
    </div>
  );
};