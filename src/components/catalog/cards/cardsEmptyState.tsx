import { useNavigate } from 'react-router-dom';

import { PLACEHOLDER_ASSETS } from '../../../lib/assets';
import type { ProductCollection } from '../../../types/domain';

import styles from '../../ui/catalog/cards/tinderCards.module.css';

type CardsEmptyStateProps = {
    collections: ProductCollection[];
};

const CardsEmptyState = ({ collections }: CardsEmptyStateProps) => {
    const navigate = useNavigate();

    return (
        <div className={styles.emptyState}>
            <div className={styles.notCard}>
                <p className={styles.notCardText}>Товары из ассортимента брендов закончились</p>
            </div>
            <p className={styles.notCardCatText}>Но можно посмотреть подборки</p>
            <div className={styles.collectionsBlock}>
                {collections.map((item) => (
                    <div
                        key={item.id}
                        className={styles.collectionCard}
                        onClick={() => navigate(`/trands/collection/${item.id}`)}
                    >
                        <img
                            className={styles.collectionImg}
                            src={item.cover_image_url || PLACEHOLDER_ASSETS.collectionBanner}
                            alt={item.name}
                            onError={(event) => {
                                event.currentTarget.src = PLACEHOLDER_ASSETS.collectionBanner;
                            }}
                        />
                        <p className={styles.collectionTitle}>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardsEmptyState;
