import { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from '../../../app/providers/storeContext';
import CustomCheckbox from '../../../components/shared/customCheckbox';
import FullScreenButton from '../../../components/shared/fullScreenButton';
import Modal from '../../../components/shared/modal';
import useIsKeyboardOpen from '../../../hooks/useIsKeyboardOpen';
import { apiGetJson, apiSendJson } from '../../../lib/apiClient';
import { PLACEHOLDER_ASSETS, UI_ICON_ASSETS } from '../../../lib/assets';
import {
    getPrimaryCollectionId,
    isSystemCollection,
} from '../../../lib/systemCollections';
import type { EntityId, ProductCollection } from '../../../types/domain';
import CollectionForm from './collectionForm';
import styles from './saveToCollectionSheet.module.css';

type CollectionId = ProductCollection['id'];

type SaveToCollectionSheetProps = {
    isOpen: boolean;
    onClose: () => void;
    productId?: EntityId | null;
    productName?: string;
    productInCollection?: boolean;
    onSaveSuccess?: (isSaved: boolean) => void;
};

const normalizeSelectedCollectionIds = (
    collectionIds: CollectionId[],
    primaryCollectionId: CollectionId | null,
) => {
    const uniqueCollectionIds = Array.from(new Set(collectionIds));

    if (primaryCollectionId == null) {
        return uniqueCollectionIds;
    }

    const hasCustomSelection = uniqueCollectionIds.some(
        (collectionId) => collectionId !== primaryCollectionId,
    );

    if (!hasCustomSelection) {
        return uniqueCollectionIds.filter(
            (collectionId) => collectionId !== primaryCollectionId,
        );
    }

    if (!uniqueCollectionIds.includes(primaryCollectionId)) {
        return [...uniqueCollectionIds, primaryCollectionId];
    }

    return uniqueCollectionIds;
};

const toggleCollectionSelection = (
    currentSelectedCollectionIds: CollectionId[],
    collectionId: CollectionId,
    primaryCollectionId: CollectionId | null,
) => {
    const nextSelectedCollectionIds = currentSelectedCollectionIds.includes(collectionId)
        ? currentSelectedCollectionIds.filter(
            (selectedCollectionId) => selectedCollectionId !== collectionId,
        )
        : [...currentSelectedCollectionIds, collectionId];

    if (collectionId === primaryCollectionId) {
        return currentSelectedCollectionIds.includes(collectionId)
            ? currentSelectedCollectionIds.filter(
                (selectedCollectionId) => selectedCollectionId !== collectionId,
            )
            : normalizeSelectedCollectionIds(
                nextSelectedCollectionIds,
                primaryCollectionId,
            );
    }

    return normalizeSelectedCollectionIds(
        nextSelectedCollectionIds,
        primaryCollectionId,
    );
};

const SaveToCollectionSheet = observer(({
    isOpen,
    onClose,
    productId,
    productName: _productName,
    productInCollection: _productInCollection,
    onSaveSuccess,
}: SaveToCollectionSheetProps) => {
    const { authStore, collectionStore, popularStore } = useStore();
    const isKeyboardOpen = useIsKeyboardOpen();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<CollectionId[]>([]);
    const [primaryCollectionId, setPrimaryCollectionId] = useState<CollectionId | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isCollectionFormOpen, setIsCollectionFormOpen] = useState(false);

    const allCollections = authStore.collections;

    const filteredCollections = useMemo<ProductCollection[]>(
        () =>
            allCollections.filter(
                (collection: ProductCollection) =>
                    !isSystemCollection(collection) &&
                    collection.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            ),
        [allCollections, searchQuery],
    );

    const loadSelectedCollections = useCallback(async () => {
        if (!productId) {
            return;
        }

        try {
            const systemCollectionId = getPrimaryCollectionId(allCollections);
            setPrimaryCollectionId(systemCollectionId);
            setSelectedCollectionIds([]);

            const persistedCollectionIds = await apiGetJson<CollectionId[]>(
                `/v1/product/${productId}/collections`,
            );

            setSelectedCollectionIds(
                normalizeSelectedCollectionIds(
                    persistedCollectionIds ?? [],
                    systemCollectionId,
                ),
            );
        } catch (error) {
            console.error('Ошибка загрузки коллекций:', error);
        }
    }, [allCollections, productId]);

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery('');
            setIsCollectionFormOpen(false);
            return;
        }

        void loadSelectedCollections();
    }, [isOpen, loadSelectedCollections]);

    const handleCollectionToggle = (collectionId: CollectionId) => {
        setSelectedCollectionIds((currentSelectedCollectionIds) =>
            toggleCollectionSelection(
                currentSelectedCollectionIds,
                collectionId,
                primaryCollectionId,
            ),
        );
    };

    const handleCreateCollection = async (
        collectionName: string,
        coverImageUrl: string,
    ) => {
        try {
            const createdCollection = await collectionStore.createCollection(
                collectionName,
                coverImageUrl,
            );

            setSelectedCollectionIds((currentSelectedCollectionIds) =>
                normalizeSelectedCollectionIds(
                    [...currentSelectedCollectionIds, createdCollection.id],
                    primaryCollectionId,
                ),
            );
            setIsCollectionFormOpen(false);
        } catch (error) {
            console.error('Create failed:', error);
            alert('Не удалось создать коллекцию. Попробуйте снова.');
        }
    };

    const handleSave = async () => {
        if (!productId) {
            return;
        }

        setIsSaving(true);

        const nextSelectedCollectionIds = [...selectedCollectionIds];
        const isProductSaved = nextSelectedCollectionIds.length > 0;

        try {
            await apiSendJson(
                `/v1/product/${productId}/collections`,
                'PUT',
                nextSelectedCollectionIds,
            );

            popularStore.updateProductCollectionStatus(productId, isProductSaved);
            collectionStore.updateCurrentCollectionProductStatus(
                productId,
                isProductSaved,
            );
            onSaveSuccess?.(isProductSaved);
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении в коллекцию:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal size="tall" isOpen={isOpen} onClose={onClose}>
            <div className={styles.sheet}>
                <div className={styles.body}>
                    <div className={styles.header}>
                        <p className={styles.title}>Добавить в подборку</p>
                    </div>

                    <div className={styles.searchContainer}>
                        <button type="button" className={styles.searchAction}>
                            <img src={UI_ICON_ASSETS.search} alt="Поиск" />
                        </button>

                        <input
                            type="text"
                            placeholder="Поиск по подборкам"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            className={styles.searchInput}
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                className={styles.searchAction}
                                onClick={() => setSearchQuery('')}
                            >
                                <img src={UI_ICON_ASSETS.close} alt="Очистить поиск" />
                            </button>
                        )}
                    </div>

                    <div className={styles.collectionList}>
                        {filteredCollections.length > 0 ? (
                            filteredCollections.map((collection: ProductCollection) => (
                                <div key={collection.id} className={styles.collectionRow}>
                                    <div className={styles.collectionCheckboxSlot}>
                                        <CustomCheckbox
                                            id={`collection-${collection.id}`}
                                            checked={selectedCollectionIds.includes(collection.id)}
                                            onChange={() => handleCollectionToggle(collection.id)}
                                            className={styles.collectionCheckbox}
                                        />
                                    </div>

                                    <div className={styles.collectionInfo}>
                                        <img
                                            className={styles.collectionCover}
                                            src={collection.cover_image_url || PLACEHOLDER_ASSETS.collectionBanner}
                                            alt={collection.name}
                                            onError={(event) => {
                                                event.currentTarget.src = PLACEHOLDER_ASSETS.collectionBanner;
                                            }}
                                        />
                                        <span className={styles.collectionName}>{collection.name}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={styles.emptyState}>Подборки не найдены</p>
                        )}

                        <button
                            type="button"
                            className={styles.createCollectionButton}
                            onClick={() => setIsCollectionFormOpen(true)}
                        >
                            <span className={styles.createCollectionIconSlot}>
                                <img
                                    className={styles.createCollectionIcon}
                                    src={UI_ICON_ASSETS.blackAdd}
                                    alt="Создать подборку"
                                />
                            </span>
                            <span className={styles.createCollectionLabel}>Создать новую подборку</span>
                        </button>
                    </div>
                </div>

                {!isKeyboardOpen && (
                    <div className={styles.footer}>
                        <FullScreenButton
                            variant="light"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </FullScreenButton>
                    </div>
                )}
            </div>

            <Modal isOpen={isCollectionFormOpen} onClose={() => setIsCollectionFormOpen(false)}>
                <CollectionForm
                    onCreate={handleCreateCollection}
                    initialCollectionName={searchQuery}
                />
            </Modal>
        </Modal>
    );
});

export default SaveToCollectionSheet;
