import { useState } from 'react';

import { FullScreenModal } from '../../shared/fullScreenModal';
import styles from '../../ui/catalog/collection/compilation.module.css';

import type { PriceRangeFilter } from './filterTypes';

type PriceFilterProps = {
    applyFilter: (value: PriceRangeFilter) => void;
    currentValue: PriceRangeFilter;
    onClose: () => void;
};

const QUICK_PRICE_OPTIONS = [3000, 5000, 10000];

export const PriceFilter = ({
    applyFilter,
    currentValue,
    onClose,
}: PriceFilterProps) => {
    const [min, setMin] = useState(currentValue?.min?.toString() ?? '');
    const [max, setMax] = useState(currentValue?.max?.toString() ?? '');

    const selectedQuickOption = QUICK_PRICE_OPTIONS.find(
        (value) => !min && Number.parseInt(max || '0', 10) === value,
    );

    const handleApply = () => {
        applyFilter({
            min: min ? Number.parseInt(min, 10) : null,
            max: max ? Number.parseInt(max, 10) : null,
        });
    };

    return (
        <FullScreenModal
            title="Стоимость"
            onClose={onClose}
            onApply={handleApply}
            applyDisabled={!min && !max}
        >
            <div className={styles.priceInputGroup}>
                <div className={styles.inputWrapper}>
                    <input
                        className={styles.priceInput}
                        type="number"
                        placeholder="от"
                        value={min}
                        onChange={(event) => setMin(event.target.value)}
                    />
                </div>

                <span>-</span>

                <div className={styles.inputWrapper}>
                    <input
                        className={styles.priceInput}
                        type="number"
                        placeholder="до"
                        value={max}
                        onChange={(event) => setMax(event.target.value)}
                    />
                </div>
            </div>

            <div className={styles.gridOptions}>
                {QUICK_PRICE_OPTIONS.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${selectedQuickOption === option ? styles.selected : ''}`.trim()}
                        onClick={() => {
                            setMin('');
                            setMax(option.toString());
                        }}
                    >
                        до {option.toLocaleString('ru-RU')} ₽
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
