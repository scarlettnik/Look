import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

import { useStore } from '../../../app/providers/storeContext';
import { PLACEHOLDER_ASSETS, UI_ICON_ASSETS } from '../../../lib/assets';
import type { ProductCard, ProductCollection } from '../../../types/domain';

import SaveToCollectionModal from '../../collections/saveToCollectionsModal';
import Sidebar from '../../navigation/sidebar';
import CustomSkeleton from '../../shared/customSkeleton';
import styles from '../../ui/catalog/trends/popularCollection.module.css';

import PopularCollectionProductCard from './popularCollectionProductCard';

const PopularCollection = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const store = useStore();
    const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [collectionImage, setCollectionImage] = useState('');
    const [collectionName, setCollectionName] = useState('');

    const { currentCollection: collection, isLoading } = store.collectionStore;
    const currentItem: ProductCollection | null =
        store.popularStore.allCollections.find(
            (item) => String(item.id) === String(id),
        ) ?? null;

    useEffect(() => {
        const loadCollection = async () => {
            await store.collectionStore.loadCollection(id);
            if (store.collectionStore.currentCollection) {
                setCollectionImage(store.collectionStore.currentCollection.cover_image_url ?? '');
                setCollectionName(store.collectionStore.currentCollection.name ?? '');
            }
        };
        void loadCollection();
    }, [id, store.collectionStore]);

    useEffect(() => {
        if (currentItem?.cover_image_url) {
            setCollectionImage(currentItem.cover_image_url);
        }
        if (currentItem?.name && !collectionName) {
            setCollectionName(currentItem.name);
        }
    }, [currentItem?.cover_image_url, currentItem?.name, collectionName]);

    const handleOpenSaveModal = useCallback((product: ProductCard) => {
        setSelectedProduct(product);
        setIsSaveModalOpen(true);
    }, []);

    const handleCloseSaveModal = useCallback(() => {
        setIsSaveModalOpen(false);
        setSelectedProduct(null);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.stepHeader}>
                <button type="button" className={styles.backButton} onClick={() => navigate(-1)}>
                    <img src={UI_ICON_ASSETS.arrowLeft} className={styles.backButtonImg} alt="Назад" />
                </button>
                <p className={styles.stepTitle}>{collectionName}</p>
            </div>

            <div className={styles.collectionImageWrapper}>
                {isLoading ? (
                    <CustomSkeleton className={styles.collectionImage} />
                ) : (
                    <img
                        className={styles.collectionImage}
                        src={collectionImage || PLACEHOLDER_ASSETS.collectionBanner}
                        alt={collectionName}
                        onError={(event) => {
                            event.currentTarget.src = PLACEHOLDER_ASSETS.collectionBanner;
                        }}
                    />
                )}
            </div>

            <div className={styles.cardContainer}>
                {isLoading
                    ? [...Array(8)].map((_, index) => (
                        <CustomSkeleton
                            className={`${styles.card} ${styles.cardSkeleton}`.trim()}
                            key={index}
                        />
                    ))
                    : collection?.products?.map((item) => (
                        <PopularCollectionProductCard
                            key={item.id}
                            item={item}
                            onSaveClick={handleOpenSaveModal}
                        />
                    ))}
            </div>

            <Sidebar />

            <SaveToCollectionModal
                isOpen={isSaveModalOpen}
                onClose={handleCloseSaveModal}
                productId={selectedProduct?.id}
                productName={selectedProduct?.name}
                productInCollection={selectedProduct?.is_contained_in_user_collections}
            />
        </div>
    );
});

export default PopularCollection;
