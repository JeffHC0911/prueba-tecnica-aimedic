import React, { useState, FormEvent, useEffect } from "react";
import styles from "./SearchBar.module.css";
import { FiSearch, FiClock } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (city: string, startDate: string, endDate: string) => void;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading = false }) => {
  const [city, setCity] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentWeatherSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  /**
   * 
   * @param e Evento de envío del formulario
   * @description Maneja el envío del formulario, guarda la búsqueda en el localStorage y llama a la función onSearch con los parámetros necesarios.
   * @param city Ciudad a buscar
   * @param startDate Fecha de inicio (por defecto "2024-04-01")
   * @param endDate Fecha de fin (por defecto "2024-04-07")
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    /**
     * Guarda la búsqueda reciente en el localStorage y actualiza el estado de las búsquedas recientes.
     * @param city Ciudad a buscar
     * @param recentSearches Lista de búsquedas recientes
     * @description Actualiza el estado de las búsquedas recientes y guarda en el localStorage.
     * @returns {void}
     */
    const updatedSearches = [
      city,
      ...recentSearches.filter(item => item.toLowerCase() !== city.toLowerCase())
    ].slice(0, 5);
    
    /**
     * Guarda las búsquedas recientes en el localStorage y actualiza el estado de las búsquedas recientes.
     * @param updatedSearches Lista de búsquedas recientes
     * 
     * @description Actualiza el estado de las búsquedas recientes y guarda en el localStorage.
     */
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentWeatherSearches", JSON.stringify(updatedSearches));
    
    /**
     * Llama a la función onSearch con los parámetros necesarios.
     * @param city Ciudad a buscar
     * @param startDate Fecha de inicio (por defecto "2024-04-01")
     * @param endDate Fecha de fin (por defecto "2024-04-07")
     * @description Llama a la función onSearch con los parámetros necesarios.
     */
    onSearch(city, "2024-04-01", "2024-04-07");
    setShowSuggestions(false);
  };

  /**
   * 
   * @param suggestion Sugerencia seleccionada
   * @description Maneja el clic en una sugerencia, actualiza el estado de la ciudad y oculta las sugerencias.
   * @param suggestion Sugerencia seleccionada
   * @description Actualiza el estado de la ciudad y oculta las sugerencias.
   */
  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Buscar ciudad (ej: Madrid, Tokyo...)"
            className={styles.searchInput}
          />
          {loading && <span className={styles.loadingIndicator}>Buscando...</span>}
          
          {showSuggestions && recentSearches.length > 0 && (
            <div className={styles.suggestions}>
              {recentSearches.map((search, index) => (
                <div 
                  key={index}
                  className={styles.suggestionItem}
                  onMouseDown={() => handleSuggestionClick(search)}
                >
                  <FiClock className={styles.searchIcon} />
                  {search}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className={styles.searchButton}
          disabled={loading}
        >
          <FiSearch className={styles.searchIcon} />
          Buscar
        </button>
      </form>
    </div>
  );
};