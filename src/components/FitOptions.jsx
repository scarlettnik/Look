import styles from "./ui/profile.module.css";
import React from "react";
import FitOption from "./FitOption.jsx";

const FitOptions = ({ params, updateParam }) => (
    <div>
        <div className={styles.fitOptionsWrapper}>
            <div className={styles.fitOptions}>
                {["tight", "true", "oversized"].map((fit) => (
                    <FitOption
                        key={fit}
                        id={fit}
                        value={fit}
                        label={
                            fit === "tight"
                                ? "Облегающую"
                                : fit === "true"
                                    ? "В размер"
                                    : "Оверсайз"
                        }
                        currentValue={params?.fits}
                        onChange={updateParam}
                    />
                ))}
            </div>
            <div className={styles.underline}></div>

            {params?.fits?.map((fit) => (
                <div
                    key={fit}
                    className={styles.triangle}
                    data-fit={fit}
                ></div>
            ))}
        </div>
    </div>
);

export default FitOptions;
