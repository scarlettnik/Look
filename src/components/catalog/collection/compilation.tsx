import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useLocation, useParams } from 'react-router-dom';

import { useStore } from '../../../app/providers/storeContext';
import type { ProductCard } from '../../../types/domain';

import Sidebar from '../../navigation/sidebar';
import styles from '../../ui/catalog/collection/compilation.module.css';

import CollectionBanner from './collectionBanner';
import CollectionItemGrid from './collectionItemGrid';
import { FilterBar } from '../filters/filterBar';
import {
    createEmptyLocalCatalogFilters,
    LocalCatalogFilters,
} from '../filters/filterTypes';

const filterCollectionProducts = (
    products: ProductCard[],
    filters: LocalCatalogFilters,
) => products.filter((product) => {
    if (filters.size.length > 0) {
        const productSizes = product.sizes || [];
        const hasSizeMatch = productSizes.some((productSize) => {
            if (Array.isArray(productSize)) {
                const [sizeName, sizeMin, sizeMax] = productSize;
                return (
                    filters.size.includes(sizeName)
                    || filters.size.includes(sizeMin)
                    || filters.size.includes(sizeMax)
                );
            }

            return filters.size.includes(productSize);
        });

        if (!hasSizeMatch) {
            return false;
        }
    }

    if (filters.brand.length > 0 && !filters.brand.includes(product.brand || '')) {
        return false;
    }

    const productPrice = product.discount_price || product.price;
    if (filters.price.min !== null && (productPrice ?? 0) < filters.price.min) {
        return false;
    }
    if (filters.price.max !== null && (productPrice ?? 0) > filters.price.max) {
        return false;
    }
    if (filters.color.length > 0 && !filters.color.includes(product.color_name || '')) {
        return false;
    }
    if (filters.type.length > 0 && !filters.type.includes(product.type || '')) {
        return false;
    }

    return true;
});

const Compilation = observer(() => {
    const { id } = useParams();
    const location = useLocation();
    const { collectionStore } = useStore();
    const [isEditMode, setIsEditMode] = useState(false);
    const [filters, setFilters] = useState<LocalCatalogFilters>(createEmptyLocalCatalogFilters);

    const isSavedCollectionView = location.pathname.includes('/save/');

    useEffect(() => {
        void collectionStore.loadCollection(id);
    }, [id, collectionStore]);

    const { currentCollection: collection, isLoading, error } = collectionStore;

    const filteredProducts = useMemo(
        () => filterCollectionProducts(collection?.products || [], filters),
        [collection?.products, filters],
    );

    const handleDeleteItems = async (productIds: Array<ProductCard['id']>) => {
        try {
            await collectionStore.removeProductsFromCollection(id, productIds);
        } catch (deleteError) {
            console.error('Ошибка удаления товаров:', deleteError);
        }
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <div className={styles.errorIcon}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#666" strokeWidth="2" />
                                <path d="M15 9L9 15" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                                <path d="M9 9L15 15" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>

                        <h1 className={styles.errorTitle}>Ничего не найдено</h1>

                        <p className={styles.errorDescription}>
                            К сожалению, мы не смогли найти то, что вы искали.
                            Возможно, страница была удалена или перемещена.
                        </p>
                    </div>
                </div>
                <Sidebar />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.scrollContent}>
                <CollectionBanner
                    collectionId={id}
                    collection={collection}
                    isSavedCollection={isSavedCollectionView}
                    loading={isLoading}
                    onEnterEditMode={() => setIsEditMode(true)}
                />
                <FilterBar filters={filters} setFilters={setFilters} />
                <CollectionItemGrid
                    items={filteredProducts}
                    loading={isLoading}
                    isEditMode={isEditMode}
                    onDeleteItems={handleDeleteItems}
                    onCancelEdit={() => setIsEditMode(false)}
                />
            </div>
            <Sidebar />
        </div>
    );
});

export default Compilation;
