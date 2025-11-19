import {
  SYSTEM_COLLECTION_NAME,
  getPrimaryCollectionId,
  insertUserCollection,
  isSystemCollection,
} from '../systemCollections';
import { createCollection } from '../../test/factories';

describe('systemCollections', () => {
  it('detects system collections case-insensitively', () => {
    expect(
      isSystemCollection(
        createCollection({
          name: SYSTEM_COLLECTION_NAME.toLowerCase(),
        }),
      ),
    ).toBe(true);
    expect(isSystemCollection(createCollection({ name: 'Wishlist' }))).toBe(
      false,
    );
    expect(isSystemCollection(null)).toBe(false);
  });

  it('returns the primary system collection id when it exists', () => {
    expect(
      getPrimaryCollectionId([
        createCollection({ id: 'regular', name: 'Regular' }),
        createCollection({ id: 'favorites', name: SYSTEM_COLLECTION_NAME }),
      ]),
    ).toBe('favorites');

    expect(getPrimaryCollectionId([])).toBeNull();
  });

  it('inserts user collections after system collections and before regular ones', () => {
    const systemCollection = createCollection({
      id: 'system',
      name: SYSTEM_COLLECTION_NAME,
    });
    const existingCollection = createCollection({
      id: 'existing',
      name: 'Existing',
    });
    const nextCollection = createCollection({ id: 'next', name: 'Next' });

    expect(
      insertUserCollection(
        [existingCollection, systemCollection],
        nextCollection,
      ).map((collection) => collection.id),
    ).toEqual(['system', 'next', 'existing']);
  });
});
