import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../provider/StoreContext";
import { filterProducts } from "./utils/incideFilter";
import { BRANDS, SIZES, COLORS } from "../constants";
import styles from "./ui/compilation.module.css";
import filterStyles from "./ui/filterList.module.css";

import {PriceFilter} from "./utils/filters/PriceFilter.jsx";
import {TypeFilter} from "./utils/filters/TypeFilter.jsx";
import {useNavigate} from "react-router-dom";
import {BrandFilter} from "./utils/filters/BrandFilter.jsx";
import {SizeFilter} from "./utils/filters/SizeFilter.jsx";
import {FiltersModal} from "./utils/FiltersModal.jsx";


const AllFiltersModal = ({
                             filters,
                             applyAllFilters,
                             onClose
                         }) => {
    const [localFilters, setLocalFilters] = useState({
        size: [...(filters.size || [])],
        brand: [...(filters.brand || [])],
        price: { ...(filters.price || {}) },
        type: [...(filters.type || [])],
        color: [...(filters.color || [])]
    });

    const handleFilterChange = (filterName, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [filterName]: Array.isArray(prev[filterName])
                ? prev[filterName].includes(value)
                    ? prev[filterName].filter(v => v !== value)
                    : [...prev[filterName], value]
                : value
        }));
    };

    const handlePriceChange = (min, max) => {
        setLocalFilters(prev => ({
            ...prev,
            price: { min, max }
        }));
    };

    const handleApply = () => {
        const processedFilters = {
            ...localFilters,
            size: (localFilters.size || []).flatMap(size => {
                if (size === 'NO SIZE') return ['NO SIZE'];
                if (size.includes('/')) {
                    const parts = size.split('/');
                    const name = parts[0].trim();
                    if (parts.length > 1) {
                        const rangeParts = parts[1].split('-');
                        const min = rangeParts[0]?.trim() || '';
                        const max = rangeParts[1]?.trim() || '';
                        return [name, min, max].filter(Boolean);
                    }
                    return [name];
                }
                return [size];
            })
        };

        applyAllFilters(processedFilters);
        onClose()
    };

    return (
        <FiltersModal
            title="Фильтры"
            onClose={onClose}
            onApply={handleApply}
        >
            <div className={filterStyles.section}>
                <h3 className={filterStyles.sectionTitle}>Тип</h3>
                <div className={filterStyles.gridOptions}>
                    {['Одежда', 'Обувь', 'Аксессуары', 'Электроника'].map(type => (
                        <button
                            key={type}
                            className={`${styles.optionButton} ${
                                localFilters.type.includes(type) ? styles.selected : ''
                            }`}
                            onClick={() => handleFilterChange('type', type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <h3 className={filterStyles.sectionTitle}>Размер</h3>
                <div className={filterStyles.gridOptions}>
                    {SIZES.map(size => (
                        <button
                            key={size}
                            className={`${styles.optionButton} ${
                                localFilters.size.includes(size) ? styles.selected : ''
                            }`}
                            onClick={() => handleFilterChange('size', size)}
                        >
                            {size === 'NO SIZE' ? 'Один размер' : size}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Бренд</h3>
                <div className={styles.gridOptions}>
                    {BRANDS.map(brand => (
                        <button
                            key={brand}
                            className={`${styles.optionButton} ${
                                localFilters.brand.includes(brand) ? styles.selected : ''
                            }`}
                            onClick={() => handleFilterChange('brand', brand)}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Цвет</h3>
                <div className={styles.gridOptions}>
                    {COLORS.map(color => (
                        <button
                            key={color}
                            className={`${styles.optionButton} ${
                                localFilters.color.includes(color) ? styles.selected : ''
                            }`}
                            onClick={() => handleFilterChange('color', color)}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Цена</h3>
                <div className={styles.priceInputGroup}>
                    <input
                        type="number"
                        placeholder="от"
                        value={localFilters.price.min || ''}
                        onChange={(e) => handlePriceChange(
                            e.target.value ? parseInt(e.target.value) : null,
                            localFilters.price.max
                        )}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="до"
                        value={localFilters.price.max || ''}
                        onChange={(e) => handlePriceChange(
                            localFilters.price.min,
                            e.target.value ? parseInt(e.target.value) : null
                        )}
                    />
                </div>
            </div>
        </FiltersModal>
    );
};






export const FilterBar = observer(({
                                       filters,
                                       setFilters,
                                       catalogStore,
                                       products,
                                       onFilter
                                   }) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);
    const store = useStore();

    const navigate = useNavigate();
    const handleBack = () => navigate(-1);

    const openFilter = (filterName) => {
        setActiveFilter(filterName);
        setIsModalOpen(true);
    };

    const openAllFilters = () => {
        setIsAllFiltersOpen(true);
    };

    const closeFilter = () => {
        setIsModalOpen(false);
        setActiveFilter(null);
    };

    const closeAllFilters = () => {
        setIsAllFiltersOpen(false);
    };

    const applyFilter = (value) => {
        if (activeFilter) {
            const updatedFilters = { ...filters };

            if (activeFilter === 'price') {
                updatedFilters.price = value;
            } else {
                updatedFilters[activeFilter] = Array.isArray(value) ? value : [value];
            }

            setFilters(updatedFilters);
            applyFilters(updatedFilters);
            closeFilter();
        }
    };

    const applyAllFilters = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (updatedFilters) => {
        if (catalogStore) {
            const apiFilters = {
                sizes: updatedFilters.size || [],
                brands: updatedFilters.brand || [],
                colors: updatedFilters.color || [],
                categories: updatedFilters.type || [],
                min_price: updatedFilters.price?.min || null,
                max_price: updatedFilters.price?.max || null
            };
            catalogStore.applyFilters(apiFilters);
        } else if (onFilter) {
            const filtered = filterProducts(products || [], updatedFilters);
            onFilter(filtered);
        }
    };

    const clearFilter = (filterName, e) => {
        e.stopPropagation();

        const updatedFilters = { ...filters };

        if (filterName === 'price') {
            updatedFilters.price = { min: null, max: null };
        } else {
            updatedFilters[filterName] = [];
        }

        setFilters(updatedFilters);
        applyFilters(updatedFilters);
    };

    const isFilterActive = (filterName) => {
        if (filterName === 'price') {
            return filters.price?.min != null || filters.price?.max != null;
        }
        return filters[filterName]?.length > 0;
    };

    const renderFilterModal = () => {
        switch (activeFilter) {
            case 'size':
                return <SizeFilter applyFilter={applyFilter} currentValue={filters.size} onClose={closeFilter} />;
            case 'brand':
                return <BrandFilter applyFilter={applyFilter} currentValue={filters.brand} onClose={closeFilter} />;
            case 'price':
                return <PriceFilter applyFilter={applyFilter} currentValue={filters.price} onClose={closeFilter} />;
            case 'type':
                return <TypeFilter applyFilter={applyFilter} currentValue={filters.type} onClose={closeFilter} />;
            // case 'color':
            //     return <ColorFilter applyFilter={applyFilter} currentValue={filters.color} onClose={closeFilter} />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className={styles.filterBar}>
                <button onClick={handleBack} className={styles.filterButton}>
                    <img src='/subicons/arrowleft.svg' alt="Назад"/>
                </button>
                <button className={styles.filterButton} onClick={openAllFilters}>
                    <img src='/subicons/filter.svg' alt="Фильтры"/>
                </button>

                {[
                    {key: 'type', label: 'Тип'},
                    {key: 'size', label: 'Размер'},
                    {key: 'brand', label: 'Бренд'},
                    {key: 'price', label: 'Цена'}
                ].map(({key, label}) => {
                    const active = isFilterActive(key);
                    return (
                        <button
                            key={key}
                            className={`${styles.filterButton} ${active ? styles.activeFilter : ''}`}
                            onClick={() => openFilter(key)}
                        >
                            {label}
                            {active && (
                                <span
                                    className={styles.clearFilter}
                                    onClick={(e) => clearFilter(key, e)}
                                >
                                    <img src='/subicons/close.svg' alt="Очистить"/>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {isModalOpen && renderFilterModal()}
            {isAllFiltersOpen && (
                <AllFiltersModal
                    filters={filters}
                    applyAllFilters={applyAllFilters}
                    onClose={closeAllFilters}
                />
            )}
        </>
    );
});