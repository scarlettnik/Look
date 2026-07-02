import type { ProductCollection } from '../../../types/domain';

export type CollectionId = ProductCollection['id'];

export const normalizeSelectedCollectionIds = (
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

export const toggleCollectionSelection = (
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
