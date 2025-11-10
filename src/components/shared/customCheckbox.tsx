import styles from '../ui/shared/customCheckbox.module.css';

const CustomCheckbox = ({ id, checked, onChange, className = '' }: any) => {
    return (
        <label className={`${styles.customCheckbox} ${className}`} htmlFor={String(id)}>
            <input
                type="checkbox"
                id={String(id)}
                checked={checked}
                onChange={onChange}
                className={styles.hiddenCheckbox}
            />
            <span className={styles.checkmark}></span>
        </label>
    );
};

export default CustomCheckbox;
