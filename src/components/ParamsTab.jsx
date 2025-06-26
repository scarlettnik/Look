import styles from "./ui/profile.module.css";
import ParamControl from "./ParamControl.jsx";
import React from "react";

const ParamsTab = ({ params, updateParam }) => {
    const handleChange = (field, value) => {
        updateParam(field, value);
    };

    return (
        <div className={styles.paramsForm}>
            <div className={styles.paramsInputGroup}>
                <ParamControl
                    label="Объем груди"
                    value={params.bust}
                    onChange={(value) => handleChange("bust", value)}
                    min={40}
                    max={200}
                />
                <ParamControl
                    label="Объем талии"
                    value={params.waist}
                    onChange={(value) => handleChange("waist", value)}
                    min={40}
                    max={200}
                />

                <ParamControl
                    label="Объем бедер"
                    value={params.hip}
                    onChange={(value) => handleChange("hip", value)}
                    min={40}
                    max={200}
                />
            </div>


        </div>
    );
};
export default ParamsTab