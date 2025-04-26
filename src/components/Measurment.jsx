// Measurements.jsx
import React, { useState } from "react";
import styles from "./ui/measurment.module.css";

const Measurements = () => {
    const [data, setData] = useState({
        hip: 85,
        waist: 52,
        bust: 90,
        fit: "tight",
        showOnlyAvailable: false,
    });

    const updateValue = (key, increment) => {
        setData(prev => ({ ...prev, [key]: prev[key] + increment }));
    };

    const handleFitChange = (event) => {
        setData(prev => ({ ...prev, fit: event.target.value }));
    };

    const handleCheckboxChange = () => {
        setData(prev => ({ ...prev, showOnlyAvailable: !prev.showOnlyAvailable }));
    };

    const handleUpdate = () => {
        console.log("Updated Measurements:", data);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Measurements</div>
            <div className={styles.subtitle}>Rounded to the nearest inch</div>

            <div className={styles.measure}>
                <button onClick={() => updateValue("hip", -1)}>-</button>
                <span>{data.hip}</span>
                <button onClick={() => updateValue("hip", 1)}>+</button>
            </div>
            <div className={styles.label}>Hip</div>

            <div className={styles.measure}>
                <button onClick={() => updateValue("waist", -1)}>-</button>
                <span>{data.waist}</span>
                <button onClick={() => updateValue("waist", 1)}>+</button>
            </div>
            <div className={styles.label}>Waist</div>

            <div className={styles.measure}>
                <button onClick={() => updateValue("bust", -1)}>-</button>
                <span>{data.bust}</span>
                <button onClick={() => updateValue("bust", 1)}>+</button>
            </div>
            <div className={styles.label}>Bust</div>

            <div className={styles.label}>My preferred fit is...</div>
            <div className={styles.fitOptionsWrapper}>
                <div className={styles.fitOptions}>
                    <input
                        type="radio"
                        id="tight"
                        name="fit"
                        value="tight"
                        checked={data.fit === "tight"}
                        onChange={handleFitChange}
                    />
                    <label htmlFor="tight" className={data.fit === "tight" ? styles.active : ""}>Tight</label>
                    <input
                        type="radio"
                        id="true"
                        name="fit"
                        value="true"
                        checked={data.fit === "true"}
                        onChange={handleFitChange}
                    />
                    <label htmlFor="true" className={data.fit === "true" ? styles.active : ""}>True to Size</label>
                    <input
                        type="radio"
                        id="oversized"
                        name="fit"
                        value="oversized"
                        checked={data.fit === "oversized"}
                        onChange={handleFitChange}
                    />
                    <label htmlFor="oversized" className={data.fit === "oversized" ? styles.active : ""}>Oversized</label>
                </div>
                <div className={styles.underline}></div>
                <div className={styles.triangle} data-fit={data.fit}></div>
            </div>

            <div className={styles.checkboxContainer}>
                <input
                    type="checkbox"
                    id="showOnly"
                    checked={data.showOnlyAvailable}
                    onChange={handleCheckboxChange}
                />
                <label htmlFor="showOnly" className={styles.customCheckbox}>Only show items available in my size</label>
            </div>

            <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
        </div>
    );
};

export default Measurements;
