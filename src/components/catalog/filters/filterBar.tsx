import { Dispatch, SetStateAction, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useNavigate } from 'react-router-dom';

import type { CatalogStore } from '../../../app/stores/catalogStore';
import { UI_ICON_ASSETS } from '../../../lib/assets';

import styles from '../../ui/catalog/collection/compilation.module.css';

import AllFiltersModal from './allFiltersModal';
import { BrandFilter } from './brandFilter';
import { PriceFilter } from './priceFilter';
import { SizeFilter } from './sizeFilter';
import { TypeFilter } from './typeFilter';
import {
    hasActiveLocalFilters,
    isFilterActive,
    LocalCatalogFilters,
    PriceRangeFilter,
    QuickFilterKey,
    toApiCatalogFilters,
} from './filterTypes';

type FilterBarProps = {
    filters: LocalCatalogFilters;
    setFilters: Dispatch<SetStateAction<LocalCatalogFilters>>;
    catalogStore?: CatalogStore;
    onFilter?: (filters: LocalCatalogFilters) => void;
    onUndo?: () => void;
    undoHighlight?: boolean;
};

const FILTER_BUTTONS: Array<{ key: QuickFilterKey; label: string }> = [
    { key: 'type', label: 'Тип' },
    { key: 'size', label: 'Размер' },
    { key: 'brand', label: 'Бренд' },
    { key: 'price', label: 'Цена' },
];

export const FilterBar = observer(({
    filters,
    setFilters,
    catalogStore,
    onFilter,
    onUndo,
    undoHighlight = false,
}: FilterBarProps) => {
    const [activeFilter, setActiveFilter] = useState<QuickFilterKey | null>(null);
    const [isSingleFilterOpen, setIsSingleFilterOpen] = useState(false);
    const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isCardsPage = location.pathname.includes('cards');

    const handleApplyFilters = (nextFilters: LocalCatalogFilters) => {
        if (catalogStore) {
            void catalogStore.applyFilters(toApiCatalogFilters(nextFilters));
            return;
        }

        onFilter?.(nextFilters);
    };

    const openFilter = (filterName: QuickFilterKey) => {
        setActiveFilter(filterName);
        setIsSingleFilterOpen(true);
    };

    const closeFilter = () => {
        setIsSingleFilterOpen(false);
        setActiveFilter(null);
    };

    const applyFilter = (value: string[] | PriceRangeFilter) => {
        if (!activeFilter) {
            return;
        }

        const nextFilters: LocalCatalogFilters = {
            ...filters,
            [activeFilter]: activeFilter === 'price'
                ? value as PriceRangeFilter
                : Array.isArray(value) ? value : [],
        };

        setFilters(nextFilters);
        handleApplyFilters(nextFilters);
        closeFilter();
    };

    const applyAllFilters = (nextFilters: LocalCatalogFilters) => {
        setFilters(nextFilters);
        handleApplyFilters(nextFilters);
    };

    const clearFilter = (
        filterKey: QuickFilterKey,
        event: React.MouseEvent<HTMLSpanElement>,
    ) => {
        event.stopPropagation();

        const nextFilters: LocalCatalogFilters = {
            ...filters,
            [filterKey]: filterKey === 'price'
                ? { min: null, max: null }
                : [],
        };

        setFilters(nextFilters);
        handleApplyFilters(nextFilters);
    };

    const renderActiveFilterModal = () => {
        switch (activeFilter) {
            case 'size':
                return (
                    <SizeFilter
                        applyFilter={(value) => applyFilter(value)}
                        currentValue={filters.size}
                        onClose={closeFilter}
                    />
                );
            case 'brand':
                return (
                    <BrandFilter
                        applyFilter={(value) => applyFilter(value)}
                        currentValue={filters.brand}
                        onClose={closeFilter}
                    />
                );
            case 'price':
                return (
                    <PriceFilter
                        applyFilter={(value) => applyFilter(value)}
                        currentValue={filters.price}
                        onClose={closeFilter}
                    />
                );
            case 'type':
                return (
                    <TypeFilter
                        applyFilter={(value) => applyFilter(value)}
                        currentValue={filters.type}
                        onClose={closeFilter}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.headerContainer}>
            {isCardsPage ? (
                <button
                    type="button"
                    onClick={onUndo}
                    className={`${styles.filterButton} ${undoHighlight ? styles.highlightedButton : ''}`.trim()}
                >
                    <img
                        src={undoHighlight ? UI_ICON_ASSETS.arrowLeftWhite : UI_ICON_ASSETS.arrowLeft}
                        alt="Назад"
                    />
                </button>
            ) : (
                <button type="button" onClick={() => navigate(-1)} className={styles.filterButton}>
                    <img src={UI_ICON_ASSETS.arrowLeft} alt="Назад" />
                </button>
            )}

            <div className={styles.filterBar}>
                <button type="button" className={styles.filterButton} onClick={() => setIsAllFiltersOpen(true)}>
                    <img
                        src={hasActiveLocalFilters(filters) ? UI_ICON_ASSETS.activeFilter : UI_ICON_ASSETS.filter}
                        alt="Открыть фильтры"
                    />
                </button>

                {FILTER_BUTTONS.map(({ key, label }) => {
                    const active = isFilterActive(filters, key);

                    return (
                        <button
                            key={key}
                            type="button"
                            className={`${styles.filterButton} ${active ? styles.activeFilter : ''}`.trim()}
                            onClick={() => openFilter(key)}
                        >
                            {label}
                            {active && (
                                <span
                                    className={styles.clearFilter}
                                    onClick={(event) => clearFilter(key, event)}
                                >
                                    <img src={UI_ICON_ASSETS.close} alt="Очистить" />
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {isSingleFilterOpen && renderActiveFilterModal()}
            {isAllFiltersOpen && (
                <AllFiltersModal
                    filters={filters}
                    applyAllFilters={applyAllFilters}
                    onClose={() => setIsAllFiltersOpen(false)}
                />
            )}
        </div>
    );
});
