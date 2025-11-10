import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/providers/storeContext';
import { SIZES } from '../../../constants';

import CustomCheckbox from '../../shared/customCheckbox';
import filterStyles from '../../ui/catalog/filters/filterList.module.css';

import ColorFilterButton from './colorFilterButton';
import { FiltersModal } from './filtersModal';
import {
    LocalCatalogFilters,
    normalizeSelectedSizes,
    createEmptyLocalCatalogFilters,
} from './filterTypes';

type AllFiltersModalProps = {
    filters: LocalCatalogFilters;
    applyAllFilters: (filters: LocalCatalogFilters) => void;
    onClose: () => void;
};

const QUICK_PRICE_OPTIONS = [1500, 3000, 5000, 10000];

const AllFiltersModal = observer(({
    filters,
    applyAllFilters,
    onClose,
}: AllFiltersModalProps) => {
    const store = useStore();
    const [draftFilters, setDraftFilters] = useState<LocalCatalogFilters>(() => ({
        ...createEmptyLocalCatalogFilters(),
        ...filters,
        size: [...filters.size],
        brand: [...filters.brand],
        type: [...filters.type],
        color: [...filters.color],
        price: { ...filters.price },
    }));
    const [showAllTypes, setShowAllTypes] = useState(false);

    const metadata = store.catalogMetadataStore.metadata;
    const displayedTypes = showAllTypes
        ? metadata.categories
        : metadata.categories.slice(0, 4);

    const selectedQuickPrice = useMemo(() => {
        if (draftFilters.price.min != null) {
            return null;
        }

        return QUICK_PRICE_OPTIONS.find(
            (option) => option === draftFilters.price.max,
        ) ?? null;
    }, [draftFilters.price.max, draftFilters.price.min]);

    const toggleArrayFilter = (
        filterKey: 'size' | 'brand' | 'type' | 'color',
        value: string,
    ) => {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            [filterKey]: currentFilters[filterKey].includes(value)
                ? currentFilters[filterKey].filter((currentValue) => currentValue !== value)
                : [...currentFilters[filterKey], value],
        }));
    };

    const handlePriceChange = (min: number | null, max: number | null) => {
        setDraftFilters((currentFilters) => ({
            ...currentFilters,
            price: { min, max },
        }));
    };

    const handleApply = () => {
        applyAllFilters({
            ...draftFilters,
            size: normalizeSelectedSizes(draftFilters.size),
        });
        onClose();
    };

    return (
        <FiltersModal title="Фильтры" onClose={onClose} onApply={handleApply}>
            <div className={filterStyles.section}>
                <div className={filterStyles.sectionHeader}>
                    <div className={filterStyles.genderLabels}>
                        <span className={`${filterStyles.sectionTitle} ${filterStyles.genderLabelFemale}`}>
                            Женское
                        </span>
                        <span className={`${filterStyles.sectionTitle} ${filterStyles.genderLabelMale}`}>
                            Мужское
                        </span>
                    </div>
                    <button
                        type="button"
                        className={filterStyles.showAllButton}
                        onClick={() => setShowAllTypes((currentValue) => !currentValue)}
                    >
                        {showAllTypes ? 'Скрыть' : 'Смотреть все'}
                    </button>
                </div>
                <div className={filterStyles.typeOptions}>
                    {displayedTypes.map((type, index) => (
                        <label key={type} className={filterStyles.checkboxLabel}>
                            <CustomCheckbox
                                className={filterStyles.checkbox}
                                id={`type-filter-${index}`}
                                checked={draftFilters.type.includes(type)}
                                onChange={() => toggleArrayFilter('type', type)}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <p className={filterStyles.sectionTitle}>Стоимость</p>
                <div className={filterStyles.priceInputGroup}>
                    <div className={filterStyles.priceInput}>
                        <input
                            type="number"
                            placeholder="от"
                            value={draftFilters.price.min ?? ''}
                            onChange={(event) => handlePriceChange(
                                event.target.value ? Number.parseInt(event.target.value, 10) : null,
                                draftFilters.price.max,
                            )}
                        />
                    </div>
                    <span className={filterStyles.priceDivider} />
                    <div className={filterStyles.priceInput}>
                        <input
                            type="number"
                            placeholder="до"
                            value={draftFilters.price.max ?? ''}
                            onChange={(event) => handlePriceChange(
                                draftFilters.price.min,
                                event.target.value ? Number.parseInt(event.target.value, 10) : null,
                            )}
                        />
                    </div>
                </div>
                <div className={filterStyles.gridOptions}>
                    {QUICK_PRICE_OPTIONS.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`${filterStyles.optionButton} ${selectedQuickPrice === option ? filterStyles.selected : ''}`.trim()}
                            onClick={() => handlePriceChange(null, option)}
                        >
                            до {option.toLocaleString('ru-RU')} ₽
                        </button>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <h3 className={filterStyles.sectionTitle}>Бренд</h3>
                <div className={filterStyles.flexOptions}>
                    {metadata.brands.map((brand) => (
                        <button
                            key={brand}
                            type="button"
                            className={`${filterStyles.optionButton} ${draftFilters.brand.includes(brand) ? filterStyles.selected : ''}`.trim()}
                            onClick={() => toggleArrayFilter('brand', brand)}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <p className={filterStyles.sectionTitle}>Размер</p>
                <div className={filterStyles.gridOptions}>
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            type="button"
                            className={`${filterStyles.optionButton} ${draftFilters.size.includes(size) ? filterStyles.selected : ''}`.trim()}
                            onClick={() => toggleArrayFilter('size', size)}
                        >
                            {size === 'NO SIZE' ? 'Один размер' : size}
                        </button>
                    ))}
                </div>
            </div>

            <div className={filterStyles.section}>
                <p className={filterStyles.sectionTitle}>
                    Цвет
                    {draftFilters.color.length > 0 && (
                        <span className={`${filterStyles.colorTitle} ${filterStyles.colorSummary}`}>
                            {draftFilters.color.slice(0, 2).join(', ')}
                            {draftFilters.color.length > 2 ? ` и еще ${draftFilters.color.length - 2}` : ''}
                        </span>
                    )}
                </p>

                <div className={filterStyles.gridOptions}>
                    {Object.entries(metadata.colors).map(([colorName, colorValue]) => (
                        <ColorFilterButton
                            key={colorName}
                            colorName={colorName}
                            colorValue={colorValue}
                            isSelected={draftFilters.color.includes(colorName)}
                            onClick={() => toggleArrayFilter('color', colorName)}
                        />
                    ))}
                </div>
            </div>
        </FiltersModal>
    );
});

export default AllFiltersModal;
