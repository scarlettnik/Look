import { useNavigate } from 'react-router-dom';

import { NAVIGATION_ICON_ASSETS, PLACEHOLDER_ASSETS } from '../../../lib/assets';
import type { ProductCard } from '../../../types/domain';

import styles from '../../ui/catalog/trends/popularCollection.module.css';

type PopularCollectionProductCardProps = {
    item: ProductCard;
    onSaveClick: (product: ProductCard) => void;
};

const PopularCollectionProductCard = ({
    item,
    onSaveClick,
}: PopularCollectionProductCardProps) => {
    const navigate = useNavigate();

    return (
        <div className={styles.productWrapper}>
            <img
                onClick={() => navigate(`/trands/product/${item.id}`)}
                className={styles.card}
                src={item.image_urls?.[0] || PLACEHOLDER_ASSETS.stylePreview}
                alt={item.name}
                onError={(event) => {
                    event.currentTarget.src = PLACEHOLDER_ASSETS.stylePreview;
                }}
            />
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onSaveClick(item);
                }}
            >
                <img
                    className={styles.saveIcon}
                    src={item.is_contained_in_user_collections
                        ? NAVIGATION_ICON_ASSETS.active.save
                        : NAVIGATION_ICON_ASSETS.inactive.save}
                    alt={item.is_contained_in_user_collections ? 'Сохранено' : 'Сохранить'}
                />
            </button>
        </div>
    );
};

export default PopularCollectionProductCard;
