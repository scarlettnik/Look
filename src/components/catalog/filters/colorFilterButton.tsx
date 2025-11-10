import { useEffect, useRef } from 'react';

import filterStyles from '../../ui/catalog/filters/filterList.module.css';

type ColorFilterButtonProps = {
    colorName: string;
    colorValue: string;
    isSelected: boolean;
    onClick: () => void;
};

const ColorFilterButton = ({
    colorName,
    colorValue,
    isSelected,
    onClick,
}: ColorFilterButtonProps) => {
    const colorPreviewRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (colorPreviewRef.current) {
            colorPreviewRef.current.style.backgroundColor = colorValue;
        }
    }, [colorValue]);

    return (
        <button
            type="button"
            aria-label={colorName}
            className={filterStyles.transparentButton}
            onClick={onClick}
        >
            <span
                ref={colorPreviewRef}
                className={`${filterStyles.colorCircle} ${isSelected ? filterStyles.selected : ''}`.trim()}
            />
        </button>
    );
};

export default ColorFilterButton;
