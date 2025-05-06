import { useState } from 'react';
import { Undo2, X, Clock, TrendingUp } from 'lucide-react';
import styles from '../ui/product.module.css';
export const SearchHeader = ({ onUndo, undoDisabled }) => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Временные данные для примера
    const searchHistory = ['Платья', 'Кроссовки', 'Джинсы'];
    const popularSearches = ['Куртки', 'Сумки', 'Аксессуары', 'Юбки'];

    return (
        <>
            <div className={styles.searchHeader}>
                <button
                    onClick={onUndo}
                    disabled={undoDisabled}
                    className={styles.backButton}
                >
                    <Undo2/>
                </button>
                <input
                    type="text"
                    placeholder={searchQuery || 'Looking for something specific?'}
                    className={styles.searchInput}
                    onClick={() => setIsSearchActive(true)}
                    readOnly={!isSearchActive}
                />
                <div className={styles.logo}>styl.</div>
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
                                            onClick={() => {setSearchQuery(item), setIsSearchActive(false)}}
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
                                            onClick={() => {setSearchQuery(item), setIsSearchActive(false)}}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className={styles.searchResults}>

                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};