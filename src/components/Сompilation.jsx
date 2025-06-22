import Sidebar from './Sidebar';
import {useLocation, Link, useNavigate} from 'react-router-dom';
import styles from './ui/compilation.module.css'

const PriceRangeFilter = ({ onApply, initialMin, initialMax }) => {
    const [minPrice, setMinPrice] = useState(initialMin || '');
    const [maxPrice, setMaxPrice] = useState(initialMax || '');

    const handleApply = () => {
        onApply({
            min: minPrice ? parseInt(minPrice) : null,
            max: maxPrice ? parseInt(maxPrice) : null
        });
    };

    return (
        <div className={styles.priceFilterContainer}>
            <div className={styles.priceInputs}>
                <input
                    type="number"
                    placeholder="От"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className={styles.priceInput}
                />
                <span className={styles.priceSeparator}>-</span>
                <input
                    type="number"
                    placeholder="До"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className={styles.priceInput}
                />
            </div>
            <button
                className={styles.applyPriceButton}
                onClick={handleApply}
                disabled={!minPrice && !maxPrice}
            >
                Применить
            </button>
        </div>
    );
};

const Compilation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const save = state?.save;
    console.log(save)

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.scrollContent}>
                <div className={styles.bannerContainer}>
                    <div className={styles.banner}>
                        <button onClick={handleBack} className={styles.editButton}>←</button>
                        <img
                            src={save.url}
                            alt="All Saved"
                            className={styles.bannerImage}
                        />
                        <div className={styles.bannerText}>{save.name}</div>
                        <button className={styles.editButton}>✏️</button>
                    </div>
                </div>

                <div className={styles.filterBar}>
                    <button className={styles.filterButton}><img src='/subicons/arrowLeft.svg'/></button>
                    <button className={styles.filterButton}><img src='/subicons/filter.svg'/></button>
                    <button className={styles.filterButton}>Размеhhhhhhhhhhhhhhhhhр</button>
                    <button className={styles.filterButton}>Бренд</button>
                    <button className={styles.filterButton}>Стоимость</button>
                    <button className={styles.filterButton}>Тип</button>
                </div>

                <div className={styles.itemsGrid}>
                    {save.items.map((item, index) => (
                        <Link
                            to={`/product/${item.id}`}
                            key={index}
                            state={{ item }}
                            className="save-card"
                        >
                            <img
                                src={item.url}
                                alt={`item-${index}`}
                                className={styles.itemImage}
                            />
                        </Link>
                    ))}
                </div>
            </div>
            <Sidebar />
        </div>
    );
};

export default Compilation;