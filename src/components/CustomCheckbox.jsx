import React from 'react';
import styles from './ui/customCheckbox.module.css';

const CustomCheckbox = ({ id, checked, onChange }) => {
    return (
        <label className={styles.customCheckbox} htmlFor={id}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className={styles.hiddenCheckbox}
            />
            <span className={styles.checkmark}></span>
        </label>
    );
};

export default CustomCheckbox;