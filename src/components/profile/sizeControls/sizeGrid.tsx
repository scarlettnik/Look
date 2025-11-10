import styles from "../../ui/profile/profile.module.css";
import {sizeRanges} from "../../../constants";

const SizeGrid = ({ params, updateParam, tone = 'default' }: any) => {
    const handleChange = (value) => {
        updateParam("clothing_size", value);
    };

    const toneClassName = tone === 'muted' ? styles.sizeBoxMuted : '';

    return (
        <div className={styles.sizesGrid}>
            {Object.keys(sizeRanges).map(size => (
                <div
                    key={size}
                    className={`${styles.sizeBox} ${toneClassName} ${params?.clothing_size === size ? styles.selectedSize : styles.unSelectedSize}`.trim()}
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
