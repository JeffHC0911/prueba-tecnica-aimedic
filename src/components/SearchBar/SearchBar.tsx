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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    
    // Guardar en búsquedas recientes
    const updatedSearches = [
      city,
      ...recentSearches.filter(item => item.toLowerCase() !== city.toLowerCase())
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentWeatherSearches", JSON.stringify(updatedSearches));
    
    onSearch(city, "2024-04-01", "2024-04-07"); // Fechas por defecto
    setShowSuggestions(false);
  };

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