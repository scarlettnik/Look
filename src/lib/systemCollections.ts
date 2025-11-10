import type { EntityId, ProductCollection } from '../types/domain';

export const SYSTEM_COLLECTION_NAME = '__FAVOURITES__';

export const isSystemCollection = (
  collection?: ProductCollection | null,
): boolean =>
  Boolean(collection?.name?.toUpperCase() === SYSTEM_COLLECTION_NAME);

export const getPrimaryCollectionId = (
  collections: ProductCollection[] = [],
): EntityId | null => collections.find(isSystemCollection)?.id ?? null;

export const insertUserCollection = (
  collections: ProductCollection[] = [],
  collection: ProductCollection,
) => {
  const systemCollections = collections.filter(isSystemCollection);
  const userCollections = collections.filter(
    (currentCollection) => !isSystemCollection(currentCollection),
  );

  return [...systemCollections, collection, ...userCollections];
};
