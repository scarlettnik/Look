import type { ProductCard, ProductCollection } from '../types/domain';

export const createProductCard = (
  overrides: Partial<ProductCard> = {},
): ProductCard => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Oversized blazer',
  brand: overrides.brand ?? 'Look',
  type: overrides.type ?? 'jacket',
  price: overrides.price ?? 12000,
  discount_price: overrides.discount_price ?? null,
  description: overrides.description ?? 'Structured jacket',
  image_urls: overrides.image_urls ?? ['https://example.com/product.jpg'],
  sizes: overrides.sizes ?? ['M'],
  color_name: overrides.color_name ?? 'black',
  is_contained_in_user_collections:
    overrides.is_contained_in_user_collections ?? false,
  ...overrides,
});

export const createProductCards = (count: number) =>
  Array.from({ length: count }, (_, index) =>
    createProductCard({
      id: index + 1,
      name: `Product ${index + 1}`,
    }),
  );

export const createCollection = (
  overrides: Partial<ProductCollection> = {},
): ProductCollection => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Capsule wardrobe',
  cover_image_url:
    overrides.cover_image_url ?? 'https://example.com/collection.jpg',
  products: overrides.products ?? [createProductCard()],
  ...overrides,
});
