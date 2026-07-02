import {
  normalizeSelectedCollectionIds,
  toggleCollectionSelection,
} from '../collectionSelection';

describe('collectionSelection', () => {
  it('deduplicates ids and removes standalone primary collection', () => {
    expect(normalizeSelectedCollectionIds([1, 1, 2], null)).toEqual([1, 2]);
    expect(normalizeSelectedCollectionIds([1], 1)).toEqual([]);
  });

  it('keeps the primary collection when custom collections are selected', () => {
    expect(normalizeSelectedCollectionIds([2], 1)).toEqual([2, 1]);
    expect(normalizeSelectedCollectionIds([2, 1], 1)).toEqual([2, 1]);
  });

  it('toggles collections while preserving primary collection rules', () => {
    expect(toggleCollectionSelection([], 2, 1)).toEqual([2, 1]);
    expect(toggleCollectionSelection([2, 1], 2, 1)).toEqual([]);
    expect(toggleCollectionSelection([], 1, 1)).toEqual([]);
    expect(toggleCollectionSelection([1], 1, 1)).toEqual([]);
  });
});
