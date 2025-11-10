import styles from "../../ui/profile/profile.module.css";
import ParamControl from "./paramControl";

const ParamsTab = ({ params, updateParam }: any) => {
    const handleChange = (field, value) => {
        updateParam(field, value);
    };

    return (
        <div className={`${styles.paramsForm} ${styles.paramsFormCompact}`}>
            <div className={styles.paramsInputGroup}>
                <ParamControl
                    label="Объем груди"
                    value={params.size_parameters?.breast || 90}
                    onChange={(value) => handleChange("breast", value)}
                    min={40}
                    max={200}
                />
                <ParamControl
                    label="Объем талии"
                    value={params.size_parameters?.waist || 60}
                    onChange={(value) => handleChange("waist", value)}
                    min={40}
                    max={200}
                />
                <ParamControl
                    label="Объем бедер"
                    value={params.size_parameters?.hip || 90}
                    onChange={(value) => handleChange("hip", value)}
                    min={40}
                    max={200}
                />
            </div>
        </div>
    );
};
export default ParamsTab
