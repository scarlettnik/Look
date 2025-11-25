import { PopularStore } from '../popularStore';
import { apiGetJson } from '../../../lib/apiClient';
import { createCollection, createProductCard } from '../../../test/factories';

jest.mock('../../../lib/apiClient', () => ({
  apiGetJson: jest.fn(),
}));

const mockedApiGetJson = jest.mocked(apiGetJson);

describe('PopularStore', () => {
  beforeEach(() => {
    mockedApiGetJson.mockReset();
  });

  it('fetches global trends once and exposes all collections', async () => {
    const collection = createCollection({ id: 'trend-1' });
    mockedApiGetJson.mockResolvedValue([collection]);
    const store = new PopularStore();

    await store.fetchGlobalTrends();
    await store.fetchGlobalTrends();

    expect(mockedApiGetJson).toHaveBeenCalledTimes(1);
    expect(mockedApiGetJson).toHaveBeenCalledWith('/v1/feature/trends/global');
    expect(store.globalTrendCollections).toEqual([collection]);
    expect(store.allCollections).toEqual([collection]);
  });

  it('fetches personal trends and brand collections through their endpoints', async () => {
    const personalTrend = createCollection({ id: 'personal-trend' });
    const globalBrand = createCollection({ id: 'global-brand' });
    const personalBrand = createCollection({ id: 'personal-brand' });
    mockedApiGetJson
      .mockResolvedValueOnce([personalTrend])
      .mockResolvedValueOnce([globalBrand])
      .mockResolvedValueOnce([personalBrand]);
    const store = new PopularStore();

    await store.fetchPersonalTrends();
    await store.fetchGlobalBrands();
    await store.fetchPersonalBrands();

    expect(mockedApiGetJson).toHaveBeenNthCalledWith(
      1,
      '/v1/feature/trends/personal',
    );
    expect(mockedApiGetJson).toHaveBeenNthCalledWith(
      2,
      '/v1/feature/brands/global',
    );
    expect(mockedApiGetJson).toHaveBeenNthCalledWith(
      3,
      '/v1/feature/brands/personal',
    );
    expect(store.allCollections.map((collection) => collection.id)).toEqual([
      'personal-trend',
      'global-brand',
      'personal-brand',
    ]);
  });

  it('updates saved status across trend and brand collections', () => {
    const product = createProductCard({ id: 5 });
    const store = new PopularStore();
    store.globalTrendCollections = [createCollection({ products: [product] })];
    store.personalBrandCollections = [createCollection({ products: [product] })];

    store.updateProductCollectionStatus(5, true);

    expect(
      store.globalTrendCollections[0].products?.[0]
        .is_contained_in_user_collections,
    ).toBe(true);
    expect(
      store.personalBrandCollections[0].products?.[0]
      .is_contained_in_user_collections,
    ).toBe(true);
  });

  it('resets collections and loading state', () => {
    const store = new PopularStore();
    store.globalTrendCollections = [createCollection({ id: 1 })];
    store.personalTrendCollections = [createCollection({ id: 2 })];
    store.globalBrandCollections = [createCollection({ id: 3 })];
    store.personalBrandCollections = [createCollection({ id: 4 })];
    store.isGlobalTrendsLoading = true;
    store.isPersonalTrendsLoading = true;
    store.isGlobalBrandsLoading = true;
    store.isPersonalBrandsLoading = true;

    store.reset();

    expect(store.allCollections).toEqual([]);
    expect(store.isGlobalTrendsLoading).toBe(false);
    expect(store.isPersonalTrendsLoading).toBe(false);
    expect(store.isGlobalBrandsLoading).toBe(false);
    expect(store.isPersonalBrandsLoading).toBe(false);
  });
});
