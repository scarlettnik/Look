import { useState } from 'react';

import { SIZES } from '../../../constants';

import { FullScreenModal } from '../../shared/fullScreenModal';
import styles from '../../ui/catalog/collection/compilation.module.css';

import { normalizeSelectedSizes } from './filterTypes';

type SizeFilterProps = {
    applyFilter: (value: string[]) => void;
    currentValue: string[];
    onClose: () => void;
};

export const SizeFilter = ({
    applyFilter,
    currentValue,
    onClose,
}: SizeFilterProps) => {
    const [selectedSizes, setSelectedSizes] = useState(currentValue || []);

    const toggleSize = (size: string) => {
        setSelectedSizes((currentSizes) => (
            currentSizes.includes(size)
                ? currentSizes.filter((currentSize) => currentSize !== size)
                : [...currentSizes, size]
        ));
    };

    const handleApply = () => {
        applyFilter(normalizeSelectedSizes(selectedSizes));
        onClose();
    };

    return (
        <FullScreenModal
            title="Размер"
            onClose={onClose}
            onApply={handleApply}
            applyDisabled={!selectedSizes.length}
        >
            <div className={styles.gridOptions}>
                {SIZES.map((size) => (
                    <button
                        key={size}
                        type="button"
                        className={`${styles.optionButton} ${selectedSizes.includes(size) ? styles.selected : ''}`.trim()}
                        onClick={() => toggleSize(size)}
                    >
                        {size === 'NO SIZE' ? 'Один размер' : size}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
