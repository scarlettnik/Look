import {
  createEmptyLocalCatalogFilters,
  hasActiveLocalFilters,
  isFilterActive,
  normalizeSelectedSizes,
  toApiCatalogFilters,
} from '../filterTypes';

describe('filterTypes', () => {
  it('creates an empty local filter state', () => {
    expect(createEmptyLocalCatalogFilters()).toEqual({
      size: [],
      brand: [],
      price: { min: null, max: null },
      type: [],
      color: [],
    });
  });

  it('normalizes display sizes into searchable size tokens', () => {
    expect(normalizeSelectedSizes(['XS / 40 - 42', 'NO SIZE', 'M'])).toEqual([
      'XS',
      '40',
      '42',
      'NO SIZE',
      'M',
    ]);
  });

  it('maps local filters to the catalog API contract', () => {
    expect(
      toApiCatalogFilters({
        size: ['M'],
        brand: ['Zara'],
        price: { min: 1000, max: 5000 },
        type: ['dress'],
        color: ['black'],
      }),
    ).toEqual({
      sizes: ['M'],
      brands: ['Zara'],
      categories: ['dress'],
      colors: ['black'],
      min_price: 1000,
      max_price: 5000,
    });
  });

  it('detects active quick filters and complete filter state', () => {
    const filters = createEmptyLocalCatalogFilters();

    expect(hasActiveLocalFilters(filters)).toBe(false);
    expect(isFilterActive(filters, 'price')).toBe(false);

    filters.price.max = 5000;
    expect(isFilterActive(filters, 'price')).toBe(true);
    expect(hasActiveLocalFilters(filters)).toBe(true);

    filters.brand = ['Mango'];
    expect(isFilterActive(filters, 'brand')).toBe(true);
  });
});
