import styles from '../ui/product.module.css'
import {ChevronDown, SlidersHorizontal} from "lucide-react";

export const FilterBar = () => (
    <div className={styles.filterBar}>
        <button className={styles.filterButton}>
            <SlidersHorizontal size={18}/>
        </button>
        {['Sale', 'Brand', 'Product', 'Color'].map((text, idx) => (
            <button key={idx} className={styles.filterButton}>
                {text}
                {idx > 0 && <ChevronDown size={18}/>}
            </button>
        ))}
    </div>
);