import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { PLACEHOLDER_ASSETS } from '../../../lib/assets';
import type { EntityId, ProductCard } from '../../../types/domain';

import ButtonWrapper from '../../shared/buttonWrapper';
import CustomCheckbox from '../../shared/customCheckbox';
import CustomSkeleton from '../../shared/customSkeleton';
import FullScreenButton from '../../shared/fullScreenButton';
import styles from '../../ui/catalog/collection/compilation.module.css';

type CollectionItemGridProps = {
    items: ProductCard[];
    loading: boolean;
    isEditMode: boolean;
    onDeleteItems: (productIds: EntityId[]) => Promise<void> | void;
    onCancelEdit: () => void;
};

const CollectionItemGrid = ({
    items,
    loading,
    isEditMode,
    onDeleteItems,
    onCancelEdit,
}: CollectionItemGridProps) => {
    const [selectedItemIds, setSelectedItemIds] = useState<EntityId[]>([]);

    useEffect(() => {
        if (!isEditMode) {
            setSelectedItemIds([]);
        }
    }, [isEditMode]);

    const toggleItemSelection = (itemId: EntityId) => {
        setSelectedItemIds((currentSelectedIds) => (
            currentSelectedIds.includes(itemId)
                ? currentSelectedIds.filter((selectedItemId) => selectedItemId !== itemId)
                : [...currentSelectedIds, itemId]
        ));
    };

    const handleDelete = async () => {
        if (!selectedItemIds.length) {
            return;
        }

        await onDeleteItems(selectedItemIds);
        setSelectedItemIds([]);
        onCancelEdit();
    };

    if (loading) {
        return (
            <div className={styles.itemsGrid}>
                {[...Array(8)].map((_, index) => (
                    <CustomSkeleton
                        key={index}
                        className={`${styles.itemImage} ${styles.itemImageSkeleton}`.trim()}
                    />
                ))}
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className={styles.emptyStateCard}>
                <p className={styles.emptyStateText}>Нет доступных товаров</p>
            </div>
        );
    }

    return (
        <div className={styles.itemsGrid}>
            {isEditMode && (
                <ButtonWrapper>
                    <FullScreenButton
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={selectedItemIds.length === 0}
                    >
                        Удалить выбранные
                    </FullScreenButton>
                    <FullScreenButton className={styles.cancelButton} onClick={onCancelEdit}>
                        Отменить
                    </FullScreenButton>
                </ButtonWrapper>
            )}

            {items.map((item) => (
                <div key={item.id} className={styles.itemContainer}>
                    {isEditMode && (
                        <div
                            className={styles.checkboxContainer}
                            onClick={(event) => {
                                event.stopPropagation();
                                toggleItemSelection(item.id);
                            }}
                        >
                            <CustomCheckbox
                                id={`item-${item.id}`}
                                checked={selectedItemIds.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className={styles.itemCheckbox}
                            />
                        </div>
                    )}
                    <Link to={`product/${item.id}`} className={styles.itemLink}>
                        <img
                            src={item.image_urls?.[0] || PLACEHOLDER_ASSETS.stylePreview}
                            alt={item.name}
                            className={styles.itemImage}
                            onError={(event) => {
                                event.currentTarget.src = PLACEHOLDER_ASSETS.stylePreview;
                            }}
                        />
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default CollectionItemGrid;
