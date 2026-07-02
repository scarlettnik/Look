import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { useStore } from '../../../app/providers/storeContext';
import { apiSendJson } from '../../../lib/apiClient';
import type { CatalogSearchRequest } from '../../../types/domain';
import { UI_ICON_ASSETS } from '../../../lib/assets';

import styles from '../../ui/catalog/cards/search.module.css';

type SearchHeaderMainProps = {
    onSearch?: (request: CatalogSearchRequest) => void;
    onClearSearch?: () => void;
    isSearchActive?: boolean;
    onSearchActiveChange?: (value: boolean) => void;
};

const SearchHeaderMain = ({
    onSearch,
    onClearSearch,
    isSearchActive: externalIsSearchActive,
    onSearchActiveChange,
}: SearchHeaderMainProps) => {
    const store = useStore();
    const currentSearchQuery = store.catalogStore.currentSearchQuery || '';
    const [searchQuery, setSearchQuery] = useState(currentSearchQuery);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [internalIsSearchActive, setInternalIsSearchActive] = useState(false);

    const searchRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSearchActive = externalIsSearchActive !== undefined
        ? externalIsSearchActive
        : internalIsSearchActive;

    const setIsSearchActive = useCallback((value: boolean) => {
        if (externalIsSearchActive !== undefined) {
            onSearchActiveChange?.(value);
            return;
        }

        setInternalIsSearchActive(value);
    }, [externalIsSearchActive, onSearchActiveChange]);

    const closeSearch = useCallback(() => {
        setIsSearchActive(false);
        inputRef.current?.blur();
        setSuggestions([]);
    }, [setIsSearchActive]);

    const fetchSuggestions = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const data = await apiSendJson<string[]>(
                '/v1/catalog/search/suggestions',
                'POST',
                { query },
            );
            setSuggestions(Array.from(new Set(data ?? [])));
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSearch = useCallback((query = searchQuery) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            closeSearch();
            return;
        }

        setSearchQuery(trimmedQuery);
        store.catalogStore.setLastSearchQuery(trimmedQuery);
        onSearch?.({ query: trimmedQuery });
        closeSearch();
    }, [searchQuery, store.catalogStore, onSearch, closeSearch]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
        setSearchQuery(suggestion);
        handleSearch(suggestion);
    }, [handleSearch]);

    const handleClearInput = useCallback(() => {
        setSearchQuery('');
        setSuggestions([]);
        store.catalogStore.clearLastSearchQuery();
        onClearSearch?.();
        closeSearch();
    }, [store.catalogStore, onClearSearch, closeSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === 'Enter'
                && isSearchActive
                && document.activeElement === inputRef.current
            ) {
                handleSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isSearchActive, handleSearch]);

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (searchQuery && isSearchActive) {
            debounceTimer.current = setTimeout(() => {
                void fetchSuggestions(searchQuery);
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

    useEffect(() => {
        setSearchQuery(currentSearchQuery);
    }, [currentSearchQuery]);

    return (
        <>
            {isSearchActive && (
                <div
                    className={`${styles.searchOverlay} ${styles.searchOverlayVisible}`}
                    onClick={closeSearch}
                />
            )}

            <div
                className={`${styles.searchWrapper} ${isSearchActive ? styles.searchWrapperActive : ''}`.trim()}
                ref={searchRef}
            >
                <div className={styles.searchContainer}>
                    <div className={styles.searchHeaderWrapper}>
                        <div className={styles.searchHeader}>
                            <button
                                type="button"
                                className={styles.iconButton}
                                onClick={() => handleSearch()}
                                aria-label="Начать поиск"
                            >
                                <img src={UI_ICON_ASSETS.search} alt="Поиск" />
                            </button>

                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                placeholder="Стиль, повод, настроение"
                                className={styles.searchInput}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                onFocus={() => setIsSearchActive(true)}
                                aria-haspopup="listbox"
                                aria-expanded={isSearchActive && suggestions.length > 0}
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    onClick={handleClearInput}
                                    aria-label="Очистить поиск"
                                >
                                    <img src={UI_ICON_ASSETS.close} alt="Очистить" />
                                </button>
                            )}
                        </div>
                    </div>

                    {isSearchActive && (
                        <div
                            className={`${styles.suggestionsWrapper} ${styles.suggestionsWrapperVisible}`}
                            role="listbox"
                        >
                            {isLoading ? (
                                <div className={styles.suggestionItem}>Загрузка...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        className={styles.suggestionButton}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        role="option"
                                    >
                                        {suggestion}
                                    </button>
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

const MemoizedSearchHeaderMain = memo(SearchHeaderMain);

export default MemoizedSearchHeaderMain;
