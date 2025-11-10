import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/providers/storeContext';

import { FullScreenModal } from '../../shared/fullScreenModal';
import styles from '../../ui/catalog/collection/compilation.module.css';

type BrandFilterProps = {
    applyFilter: (value: string[]) => void;
    currentValue: string[];
    onClose: () => void;
};

export const BrandFilter = observer(({
    applyFilter,
    currentValue,
    onClose,
}: BrandFilterProps) => {
    const [selectedBrands, setSelectedBrands] = useState(currentValue || []);
    const store = useStore();

    const toggleBrand = (brand: string) => {
        setSelectedBrands((currentBrands) => (
            currentBrands.includes(brand)
                ? currentBrands.filter((currentBrand) => currentBrand !== brand)
                : [...currentBrands, brand]
        ));
    };

    return (
        <FullScreenModal
            title="Бренд"
            onClose={onClose}
            onApply={() => applyFilter(selectedBrands)}
            applyDisabled={!selectedBrands.length}
        >
            <div className={styles.gridOptions}>
                {store.catalogMetadataStore.metadata.brands.map((brand) => (
                    <button
                        key={brand}
                        type="button"
                        className={`${styles.optionButton} ${selectedBrands.includes(brand) ? styles.selected : ''}`.trim()}
                        onClick={() => toggleBrand(brand)}
                    >
                        {brand}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
});
