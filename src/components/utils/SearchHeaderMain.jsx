import { useState, useEffect, useRef } from 'react';
import styles from '../ui/search.module.css';
import { AUTH_TOKEN } from "../../constants.js";

export const SearchHeader = ({ onSearch, onClearSearch }) => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchActive(false);
            }
        };

        if (isSearchActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchActive]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && isSearchActive) {
                handleSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchActive, searchQuery]);

    // Запрос подсказок с debounce
    useEffect(() => {
        if (searchQuery.trim() && isSearchActive) {
            const timer = setTimeout(() => {
                fetchSuggestions(searchQuery);
            }, 100);

            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, isSearchActive]);

    const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://api.lookvogue.ru/v1/catalog/search/suggestions', {
                method: 'POST',
                headers: {
                    "Authorization": `tma ${AUTH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: searchQuery })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();
            setSuggestions(data || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        inputRef.current?.focus();
        handleSearch(suggestion);
    };

    const handleClearInput = () => {
        setSearchQuery('');
        setSuggestions([]);
        inputRef.current?.focus();
        onClearSearch?.();

    };

    const handleSearch = (query = searchQuery) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            const searchRequest = {
                query: trimmedQuery,
            };

            if (onSearch) {
                onSearch(searchRequest);
            }

            setIsSearchActive(false);
            setSuggestions([]);
        }
    };

    return (
        <>
            {isSearchActive && (
                <div
                    className={styles.searchOverlay}
                    onClick={() => setIsSearchActive(false)}
                />
            )}

            <div className={styles.searchWrapper} ref={searchRef} style={{ zIndex: isSearchActive ? 100 : 1 }}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchHeaderWrapper}>
                        <div className={styles.searchHeader}>
                            <span
                                className={styles.searchIcon}
                                onClick={() => handleSearch()}
                                role="button"
                                tabIndex={0}
                            >
                                <img src="/subicons/search.svg" alt="Search"/>
                            </span>

                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                placeholder="Стиль, повод, настроение"
                                className={styles.searchInput}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchActive(true)}
                                onBlur={() => {
                                    if (!searchQuery) {
                                        setIsSearchActive(false);
                                    }
                                }}
                                aria-haspopup="listbox"
                                aria-expanded={isSearchActive && suggestions.length > 0}
                            />

                            {searchQuery && (
                                <span
                                    className={styles.clearIcon}
                                    onClick={handleClearInput}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <img src="/subicons/close.svg" alt="Clear"/>
                                </span>
                            )}
                        </div>
                    </div>

                    {isSearchActive && (
                        <div
                            className={styles.suggestionsWrapper}
                            role="listbox"
                        >
                            {isLoading ? (
                                <div className={styles.suggestionItem}>Загрузка...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className={styles.suggestionItem}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        role="option"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSuggestionClick(suggestion);
                                            }
                                        }}
                                    >
                                        {suggestion}
                                    </div>
                                ))
                            ) : searchQuery.trim() && !isLoading ? (
                                <div className={styles.suggestionItem}>Ничего не найдено</div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};