import { CatalogMetadataStore } from '../catalogMetadataStore';
import { apiGetJson } from '../../../lib/apiClient';

jest.mock('../../../lib/apiClient', () => ({
  apiGetJson: jest.fn(),
}));

const mockedApiGetJson = jest.mocked(apiGetJson);

describe('CatalogMetadataStore', () => {
  beforeEach(() => {
    mockedApiGetJson.mockReset();
  });

  it('loads metadata once and normalizes missing fields', async () => {
    mockedApiGetJson.mockResolvedValue({
      brands: ['Zara'],
      colors: { black: '#000000' },
    });
    const store = new CatalogMetadataStore();

    await store.ensureLoaded();
    await store.ensureLoaded();

    expect(mockedApiGetJson).toHaveBeenCalledTimes(1);
    expect(mockedApiGetJson).toHaveBeenCalledWith('/v1/catalog/search/meta');
    expect(store.metadata).toEqual({
      brands: ['Zara'],
      categories: [],
      colors: { black: '#000000' },
    });
    expect(store.hasLoaded).toBe(true);
    expect(store.isLoading).toBe(false);
  });

  it('keeps hasLoaded false after a failed metadata request', async () => {
    mockedApiGetJson.mockRejectedValue(new Error('Meta failed'));
    const store = new CatalogMetadataStore();

    await store.ensureLoaded();

    expect(store.error).toBe('Meta failed');
    expect(store.hasLoaded).toBe(false);
    expect(store.isLoading).toBe(false);
  });
});
