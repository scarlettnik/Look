import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ui/search.module.css';
import { AUTH_TOKEN } from "../constants.js";
import { useStore } from "../provider/StoreContext.jsx";

const SearchHeaderMain = ({
                              onSearch,
                              onClearSearch,
                              isSearchActive: externalIsSearchActive,
                              onSearchActiveChange
                          }) => {
    const store = useStore();
    const [searchQuery, setSearchQuery] = useState(store?.catalogStore?.currentSearchQuery || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [internalIsSearchActive, setInternalIsSearchActive] = useState(false);

    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const debounceTimer = useRef(null);

    // Определяем активное состояние поиска
    const isSearchActive = externalIsSearchActive !== undefined ? externalIsSearchActive : internalIsSearchActive;

    const setIsSearchActive = useCallback((value) => {
        if (externalIsSearchActive !== undefined) {
            onSearchActiveChange?.(value);
        } else {
            setInternalIsSearchActive(value);
        }
    }, [externalIsSearchActive, onSearchActiveChange]);

    // Закрытие поиска
    const closeSearch = useCallback(() => {
        setIsSearchActive(false);
        inputRef.current?.blur();
        setSuggestions([]);
    }, [setIsSearchActive]);

    // Открытие поиска
    const openSearch = useCallback(() => {
        setIsSearchActive(true);
        inputRef.current?.focus();
    }, [setIsSearchActive]);

    // Получение подсказок с дебаунсингом
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

    // Обработчик выбора подсказки
    const handleSuggestionClick = useCallback((suggestion) => {
        setSearchQuery(suggestion);
        handleSearch(suggestion);
    }, []);

    // Основной поиск
    const handleSearch = useCallback((query = searchQuery) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            setSearchQuery(trimmedQuery);
            store.catalogStore.setLastSearchQuery(trimmedQuery);
            onSearch?.({ query: trimmedQuery });
        }
        closeSearch();
    }, [searchQuery, store.catalogStore, onSearch, closeSearch]);

    // Очистка поиска
    const handleClearInput = useCallback(() => {
        setSearchQuery('');
        setSuggestions([]);
        store.catalogStore.clearLastSearchQuery();
        onClearSearch?.();
        closeSearch();
    }, [store.catalogStore, onClearSearch, closeSearch]);

    // Обработчик клика по иконке поиска
    const handleSearchIconClick = useCallback(() => {
        if (searchQuery.trim()) {
            handleSearch();
        } else {
            openSearch();
        }
    }, [searchQuery, handleSearch, openSearch]);

    // Эффект для обработки кликов вне области поиска
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                closeSearch();
            }
        };

        if (isSearchActive) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchActive, closeSearch]);

    // Эффект для обработки клавиши Enter
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && isSearchActive && document.activeElement === inputRef.current) {
                handleSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSearchActive, searchQuery, handleSearch]);

    // Эффект для дебаунсинга подсказок
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (searchQuery && isSearchActive) {
            debounceTimer.current = setTimeout(() => {
                fetchSuggestions(searchQuery);
            }, 300);
        } else {
            setSuggestions([]);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery, isSearchActive, fetchSuggestions]);

    // Эффект для синхронизации с store
    useEffect(() => {
        if (store?.catalogStore?.currentSearchQuery !== searchQuery) {
            setSearchQuery(store?.catalogStore?.currentSearchQuery || '');
        }
    }, [store?.catalogStore?.currentSearchQuery]);

    // Рендер подсказок
    const renderSuggestions = () => {
        if (!isSearchActive) return null;

        if (isLoading) {
            return <div className={styles.suggestionItem}>Загрузка...</div>;
        }

        if (suggestions.length > 0) {
            return suggestions.map((suggestion, index) => (
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
            ));
        }

        if (searchQuery && !isLoading) {
            return <div className={styles.suggestionItem}>Ничего не найдено</div>;
        }

        return null;
    };


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

export default React.memo(SearchHeaderMain);