import styles from "./ui/profile.module.css";
import React from "react";
import FitOption from "./FitOption.jsx";

const FitOptions = ({ params, updateParam}) => (
    <div>
        <div className={styles.fitOptionsWrapper}>
            <div className={styles.fitOptions}>
                <FitOption
                    id="tight"
                    value="tight"
                    label="Облегающую"
                    currentValue={params?.fit}
                    onChange={updateParam}
                />
                <FitOption
                    id="true"
                    value="true"
                    label="В размер"
                    currentValue={params?.fit}
                    onChange={updateParam}
                />
                <FitOption
                    id="oversized"
                    value="oversized"
                    label="Оверсайз"
                    currentValue={params?.fit}
                    onChange={updateParam}
                />
            </div>
            <div className={styles.underline}></div>
            <div className={styles.triangle} data-fit={params?.fit}></div>
        </div>
    </div>
);
export default FitOptions;