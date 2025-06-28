import { useState } from 'react';
import { Undo2, X, Clock, TrendingUp } from 'lucide-react';
import styles from '../ui/product.module.css';
export const SearchHeader = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchHistory = ['Платья', 'Кроссовки', 'Джинсы'];
    const popularSearches = ['Куртки', 'Сумки', 'Аксессуары', 'Юбки'];

    return (
        <>
            <div className={styles.searchHeader}>
                <span className={styles.searchIcon}>
                  <img src="/subicons/search.svg"/>
                </span>
                    <input
                        type="text"
                        placeholder={searchQuery || 'Стиль, повод, настроение'}
                        className={styles.searchInput}
                        onClick={() => setIsSearchActive(true)}
                        readOnly={!isSearchActive}
                    />
            </div>

            {isSearchActive && (
                <div className={styles.searchOverlay}>
                    <div className={styles.searchHeader}>
                        <button
                            onClick={() => setIsSearchActive(false)}
                            className={styles.backButton}
                        >
                            <X/>
                        </button>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.searchContent}>
                        {searchQuery === '' ? (
                            <>
                                <div className={styles.searchSection}>
                                    <div className={styles.sectionTitle}>
                                        <Clock size={18}/>
                                        <span>Recent Searches</span>
                                    </div>
                                    {searchHistory.map((item, index) => (
                                        <button
                                            key={index}
                                            className={styles.searchItem}
                                            onClick={() => {
                                                setSearchQuery(item), setIsSearchActive(false)
                                            }}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>

                                <div className={styles.searchSection}>
                                    <div className={styles.sectionTitle}>
                                        <TrendingUp size={18}/>
                                        <span>Popular Now</span>
                                    </div>
                                    {popularSearches.map((item, index) => (
                                        <button
                                            key={index}
                                            className={styles.searchItem}
                                            onClick={() => {
                                                setSearchQuery(item), setIsSearchActive(false)
                                            }}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.searchResults}>
                                Ничего не найдено
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};