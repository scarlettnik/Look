import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


import styles from "./ui/compilation.module.css";

export const FilterBar = ({ filters, setFilters, products }) => {
    const [activeFilter, setActiveFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    const openFilter = (filterName) => {
        setActiveFilter(filterName);
        setIsModalOpen(true);
    };

    const closeFilter = () => {
        setIsModalOpen(false);
        setActiveFilter(null);
    };

    const applyFilter = (value) => {
        if (activeFilter) {
            setFilters(prev => ({
                ...prev,
                [activeFilter]: Array.isArray(value) ? value : value
            }));
            closeFilter();
        }
    };

    const clearFilter = (filterName, e) => {
        e.stopPropagation();
        setFilters(prev => ({
            ...prev,
            [filterName]: Array.isArray(prev[filterName]) ? [] : null
        }));
    };

    const renderFilterModal = () => {
        switch (activeFilter) {
            case 'size': return <SizeFilter applyFilter={applyFilter} currentValue={filters.size} />;
            case 'brand': return <BrandFilter applyFilter={applyFilter} currentValue={filters.brand} />;
            case 'price': return <PriceFilter applyFilter={applyFilter} currentValue={filters.price} />;
            case 'type': return <TypeFilter applyFilter={applyFilter} currentValue={filters.type} />;
            default: return null;
        }
    };

    return (
        <>
            <div className={styles.filterBar}>
                <button onClick={handleBack} className={styles.filterButton}>
                    <img src='/subicons/arrowleft.svg' alt="Назад"/>
                </button>
                <button className={styles.filterButton}><img src='/subicons/filter.svg'/></button>

                {[
                    {key: 'size', label: 'Размер'},
                    {key: 'brand', label: 'Бренд'},
                    {key: 'price', label: 'Цена'},
                    {key: 'type', label: 'Тип'}
                ].map(({key, label}) => (
                    <button
                        key={key}
                        className={`${styles.filterButton} ${
                            (key === 'price'
                                ? (filters[key]?.min || filters[key]?.max)
                                : (Array.isArray(filters[key])
                                    ? filters[key].length > 0
                                    : filters[key]))
                                ? styles.activeFilter
                                : ''
                        }`}
                        onClick={() => openFilter(key)}
                    >
                        {label}
                        {(key === 'price'
                            ? (filters[key]?.min || filters[key]?.max)
                            : (Array.isArray(filters[key])
                                ? filters[key].length > 0
                                : filters[key])) && (
                            <span
                                className={styles.clearFilter}
                                onClick={(e) => clearFilter(key, e)}
                            >
                <img src='/subicons/close.svg' alt="Очистить"/>
            </span>
                        )}
                    </button>
                ))}
            </div>

            {isModalOpen && renderFilterModal()}
        </>
    );
};
const SizeFilter = ({ applyFilter, currentValue }) => {
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev =>
        prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );

    return (
        <FullScreenModal
            title="Размер"
            onClose={() => applyFilter(null)}
            onApply={() => applyFilter(selected)}
            applyDisabled={!selected.length}
        >
            <div className={styles.gridOptions}>
                {SIZES.map(size => (
                    <button
                        key={size}
                        className={`${styles.optionButton} ${selected.includes(size) ? styles.selected : ''}`}
                        onClick={() => toggle(size)}
                    >
                        {size === 'NO SIZE' ? 'Один размер' : size}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};

const BrandFilter = ({ applyFilter, currentValue }) => {
    const brands = ['Bershka', 'Zara', 'H&M', 'Zarina', 'Gloria Jeans', 'Gucci', 'Nike', 'Puma'];
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal title="Бренд" onClose={() => applyFilter(null)} onApply={() => applyFilter(selected)} applyDisabled={!selected.length}>
            <div className={styles.gridOptions}>
                {brands.map((brand, i) => (
                    <button key={i} className={`${styles.optionButton} ${selected.includes(brand) ? styles.selected : ''}`} onClick={() => toggle(brand)}>
                        {brand}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};

const TypeFilter = ({ applyFilter, currentValue }) => {
    const types = ['Одежда', 'Обувь', 'Аксессуары', 'Электроника'];
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal title="Тип" onClose={() => applyFilter(null)} onApply={() => applyFilter(selected)} applyDisabled={!selected.length}>
            <div className={styles.gridOptions}>
                {types.map((type, i) => (
                    <button key={i} className={`${styles.optionButton} ${selected.includes(type) ? styles.selected : ''}`} onClick={() => toggle(type)}>
                        {type}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
const PriceFilter = ({ applyFilter, currentValue }) => {
    const [min, setMin] = useState(currentValue?.min || '');
    const [max, setMax] = useState(currentValue?.max || '');

    const quickOptions = [3000, 5000, 10000];
    const selectedQuick = quickOptions.find((val) => !min && parseInt(max) === val);

    const apply = () => {
        applyFilter({
            min: min ? parseInt(min) : null,
            max: max ? parseInt(max) : null,
        });
    };

    const selectQuickMax = (value) => {
        setMin('');
        setMax(value.toString());
    };

    return (
        <FullScreenModal
            title="Стоимость"
            onClose={() => applyFilter(null)}
            onApply={apply}
            applyDisabled={!min && !max}
        >
            <div className={styles.priceInputGroup}>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.priceInput}
                        type="number"
                        placeholder="от"
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                    />
               </div>

                <span>-</span>

                <div className={styles.inputWrapper}>
                    <input
                        className={styles.priceInput}
                        type="number"
                        placeholder="до"
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.gridOptions}>
                {quickOptions.map((option) => (
                    <button
                        key={option}
                        className={`${styles.optionButton} ${selectedQuick === option ? styles.selected : ''}`}
                        onClick={() => selectQuickMax(option)}
                    >
                        до {option.toLocaleString()} ₽
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};

import stylesM from './ui/fullScreenModal.module.css';
import {filterProducts} from "./utils/incideFilter.js";
import {SIZES} from "../constants.js";

const FullScreenModal = ({ title, onClose, onApply, children, applyDisabled = false }) => {
    return (
        <div className={stylesM.modalOverlay}>
            <div className={stylesM.modalContent}>
                <div className={stylesM.modalHeader}>
                    <p className={stylesM.label}>{title}</p>
                    <button style={{    background: 'transparent'
                    }} onClick={onClose}>
                        <img src='/subicons/close.svg'/>
                    </button>
                </div>
                <div className={stylesM.modalBody}>{children}</div>
                <button
                    className={stylesM.applyButton}
                    onClick={onApply}
                    disabled={applyDisabled}
                >
                    Показать
                </button>
            </div>
        </div>
    );
};

