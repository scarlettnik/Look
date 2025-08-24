import styles from "./ui/profile.module.css";
import React from "react";

const SizeGrid = ({ params, updateParam, color = 'var(--white)' }) => {
    const handleChange = (value) => {
        updateParam("clothing_size", value);
    };

    const sizeRanges = {
        "XXS": "38-40",
        "XS": "40-42",
        "S": "42-44",
        "M": "44-46",
        "L": "46-48",
        "XL": "48-50",
        "XXL": "50-52",
        "3XL": "52-54",
        "4XL": "54-56"
    };

    return (
        <div className={styles.sizesGrid}>
            {Object.keys(sizeRanges).map(size => (
                <div
                    style={{backgroundColor: color}}
                    key={size}
                    className={`${styles.sizeBox} ${params?.clothing_size === size ? styles.selectedSize : styles.unSelectedSize}`}
                    onClick={() => handleChange(size)}
                >
                    {size}
                    <span className={styles.subText}>{sizeRanges[size]}</span>
                </div>
            ))}
        </div>
    );
};

export default SizeGrid;