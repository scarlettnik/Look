import {
    useId,
    type ChangeEventHandler,
    type MouseEventHandler,
} from 'react';

import styles from '../ui/shared/customCheckbox.module.css';

type CustomCheckboxProps = {
    id?: string | number;
    checked: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLElement>;
    className?: string;
};

const CustomCheckbox = ({
    id,
    checked,
    onChange,
    onClick,
    className = '',
}: CustomCheckboxProps) => {
    const generatedId = useId();
    const inputId = String(id ?? generatedId);

    return (
        <label
            className={`${styles.customCheckbox} ${className}`}
            htmlFor={inputId}
            onClick={onClick}
        >
            <input
                type="checkbox"
                id={inputId}
                checked={checked}
                onChange={onChange}
                onClick={onClick}
                className={styles.hiddenCheckbox}
            />
            <span className={styles.checkmark}></span>
        </label>
    );
};

export default CustomCheckbox;
