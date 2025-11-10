import { useState } from 'react';

import { useStore } from '../../../app/providers/storeContext';

import CustomCheckbox from '../../shared/customCheckbox';
import { FullScreenModal } from '../../shared/fullScreenModal';
import filterStyles from '../../ui/catalog/filters/filterList.module.css';

type TypeFilterProps = {
    applyFilter: (value: string[]) => void;
    currentValue: string[];
    onClose: () => void;
};

export const TypeFilter = ({
    applyFilter,
    currentValue,
    onClose,
}: TypeFilterProps) => {
    const [selectedTypes, setSelectedTypes] = useState(currentValue || []);
    const store = useStore();

    const toggleType = (type: string) => {
        setSelectedTypes((currentTypes) => (
            currentTypes.includes(type)
                ? currentTypes.filter((currentType) => currentType !== type)
                : [...currentTypes, type]
        ));
    };

    return (
        <FullScreenModal
            title="Тип"
            onClose={onClose}
            onApply={() => applyFilter(selectedTypes)}
            applyDisabled={!selectedTypes.length}
        >
            <div className={filterStyles.typeOptions}>
                {store.catalogMetadataStore.metadata.categories.map((type, index) => (
                    <label key={type} className={filterStyles.checkboxLabel}>
                        <CustomCheckbox
                            className={filterStyles.checkbox}
                            id={`checkbox-${index}`}
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                        />
                        {type}
                    </label>
                ))}
            </div>
        </FullScreenModal>
    );
};
