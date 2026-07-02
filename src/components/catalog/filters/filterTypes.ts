import type { CatalogFilters } from '../../../types/domain';

export type PriceRangeFilter = {
    min: number | null;
    max: number | null;
};

export type LocalCatalogFilters = {
    size: string[];
    brand: string[];
    price: PriceRangeFilter;
    type: string[];
    color: string[];
};

export type QuickFilterKey = 'type' | 'size' | 'brand' | 'price';

export const createEmptyLocalCatalogFilters = (): LocalCatalogFilters => ({
    size: [],
    brand: [],
    price: {
        min: null,
        max: null,
    },
    type: [],
    color: [],
});

export const normalizeSelectedSizes = (sizes: string[]) =>
    sizes.flatMap((size) => {
        if (size === 'NO SIZE') {
            return ['NO SIZE'];
        }

        if (size.includes('/')) {
            const [name, range = ''] = size.split('/').map((part) => part.trim());
            const [min, max] = range.split('-').map((part) => part.trim());
            return [name, min, max].filter(Boolean);
        }

        return [size];
    });

export const toApiCatalogFilters = (filters: LocalCatalogFilters): CatalogFilters => ({
    sizes: filters.size,
    brands: filters.brand,
    categories: filters.type,
    colors: filters.color,
    min_price: filters.price.min,
    max_price: filters.price.max,
});

export const toLocalCatalogFilters = (filters: CatalogFilters): LocalCatalogFilters => ({
    size: filters.sizes,
    brand: filters.brands,
    price: {
        min: filters.min_price,
        max: filters.max_price,
    },
    type: filters.categories,
    color: filters.colors,
});

export const isFilterActive = (
    filters: LocalCatalogFilters,
    filterKey: keyof LocalCatalogFilters,
) => {
    if (filterKey === 'price') {
        return filters.price.min != null || filters.price.max != null;
    }

    return filters[filterKey].length > 0;
};

export const hasActiveLocalFilters = (filters: LocalCatalogFilters) => (
    filters.size.length > 0
    || filters.brand.length > 0
    || filters.type.length > 0
    || filters.color.length > 0
    || filters.price.min !== null
    || filters.price.max !== null
);
