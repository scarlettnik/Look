import styles from "./ui/profile.module.css";
import React from "react";

const SizeGrid = ({ params, updateParam, color = 'var(--white)' }) => {
    const handleChange = (field, value) => {
        updateParam(field, value);
    };

    return (
        <div className={styles.sizesGrid}>
            {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(size => (
                <div
                    style={{backgroundColor: color}}
                    key={size}
                    className={`${styles.sizeBox} ${params?.size === size ? styles.selectedSize : ''}`}
                    onClick={() => handleChange("size", size)}
                >
                    {size}
                    <span className={styles.subText}>38-40</span>
                </div>
            ))}
        </div>
    );
};
export default SizeGrid