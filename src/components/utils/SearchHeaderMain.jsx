import { useState, useEffect, useRef, useCallback } from 'react';
import styles from '../ui/search.module.css';
import { AUTH_TOKEN } from "../../constants.js";
import { useStore } from "../../provider/StoreContext.jsx";

export const SearchHeader = ({ onSearch, onClearSearch }) => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const store = useStore();
    const [searchQuery, setSearchQuery] = useState(store?.catalogStore?.currentSearchQuery || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const prevIsSearchActive = useRef(isSearchActive);

    // Мемоизированные обработчики
    const closeSearch = useCallback(() => {
        setIsSearchActive(false);
        inputRef.current?.blur();
    }, []);

    const fetchSuggestions = useCallback(async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://api.lookvogue.ru/v1/catalog/search/suggestions', {
                method: 'POST',
                headers: {
                    "Authorization": `tma ${AUTH_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
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
    }, []);

    const handleSuggestionClick = useCallback((suggestion) => {
        setSearchQuery(suggestion);
        handleSearch(suggestion);
        closeSearch();
    }, [closeSearch]);

    const handleSearch = useCallback((query = searchQuery) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            const searchRequest = { query: trimmedQuery };
            store.catalogStore.setLastSearchQuery(trimmedQuery);

            if (onSearch) {
                onSearch(searchRequest);
            }

            closeSearch();
        }
    }, [searchQuery, store.catalogStore, onSearch, closeSearch]);

    const handleClearInput = useCallback(() => {
        setSearchQuery('');
        setSuggestions([]);
        store.catalogStore.clearLastSearchQuery();
        onClearSearch?.();
        closeSearch();
    }, [store.catalogStore, onClearSearch, closeSearch]);

    // Эффекты
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                closeSearch();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeSearch]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && isSearchActive) {
                handleSearch();
                closeSearch();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchActive, searchQuery, handleSearch, closeSearch]);

    useEffect(() => {
        if (searchQuery && isSearchActive) {
            const timer = setTimeout(() => {
                fetchSuggestions(searchQuery);
            }, 100);

            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, isSearchActive, fetchSuggestions]);

    useEffect(() => {
        // Сохраняем предыдущее состояние для анимации
        prevIsSearchActive.current = isSearchActive;
    }, [isSearchActive]);

    return (
        <>
            {isSearchActive && (
                <div
                    className={styles.searchOverlay}
                    onClick={closeSearch}
                    style={{
                        animation: `${styles.fadeIn} 0.2s ease-in-out`
                    }}
                />
            )}

            <div className={styles.searchWrapper} ref={searchRef} style={{ zIndex: isSearchActive ? 100 : 1 }}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchHeaderWrapper}>
                        <div className={styles.searchHeader}>
                            <span
                                className={styles.searchIcon}
                                onClick={() => {
                                    handleSearch();
                                    closeSearch();
                                }}
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
                            style={{
                                animation: `${styles.slideIn} 0.2s ease-in-out`
                            }}
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
                            ) : searchQuery && !isLoading ? (
                                <div className={styles.suggestionItem}>Ничего не найдено</div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};