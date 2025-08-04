import React, {useState} from "react";
import {FullScreenModal} from "../FullScreenModal.jsx";
import styles from "../../ui/compilation.module.css";
import {BRANDS} from "../../../constants.js";

export const BrandFilter = ({ applyFilter, currentValue, onClose }) => {
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal
            title="Бренд"
            onClose={onClose}
            onApply={() => applyFilter(selected)}
            applyDisabled={!selected.length}
        >
            <div className={styles.gridOptions}>
                {BRANDS.map((brand, i) => (
                    <button
                        key={i}
                        className={`${styles.optionButton} ${selected.includes(brand) ? styles.selected : ''}`}
                        onClick={() => toggle(brand)}
                    >
                        {brand}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
