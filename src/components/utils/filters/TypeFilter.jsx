import React, {useState} from "react";
import {FullScreenModal} from "../FullScreenModal.jsx";
import styles from "../../ui/compilation.module.css";

export const TypeFilter = ({ applyFilter, currentValue, onClose }) => {
    const [selected, setSelected] = useState(currentValue || []);

    const toggle = (val) => setSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

    return (
        <FullScreenModal
            title="Тип"
            onClose={onClose}
            onApply={() => applyFilter(selected)}
            applyDisabled={!selected.length}
        >
            <div className={styles.gridOptions}>
                {['Одежда', 'Обувь', 'Аксессуары', 'Электроника'].map((type, i) => (
                    <button
                        key={i}
                        className={`${styles.optionButton} ${selected.includes(type) ? styles.selected : ''}`}
                        onClick={() => toggle(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </FullScreenModal>
    );
};
