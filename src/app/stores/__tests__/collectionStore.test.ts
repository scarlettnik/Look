import { CollectionStore } from '../collectionStore';
import type { RootStore } from '../rootStore';
import { ApiError, apiGetJson, apiSendJson } from '../../../lib/apiClient';
import { createCollection, createProductCard } from '../../../test/factories';

jest.mock('../../../lib/apiClient', () => {
  class ApiError extends Error {
    status: number;
    payload: unknown;

    constructor(message: string, status: number, payload: unknown) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.payload = payload;
    }
  }

  return {
    ApiError,
    apiGetJson: jest.fn(),
    apiSendJson: jest.fn(),
  };
});

const mockedApiGetJson = jest.mocked(apiGetJson);
const mockedApiSendJson = jest.mocked(apiSendJson);

const createRootStoreStub = () =>
  ({
    authStore: {
      collections: [createCollection({ id: 1 }), createCollection({ id: 2 })],
      insertCollection: jest.fn(),
      removeCollections: jest.fn(),
      setCollections: jest.fn(),
      updateCollection: jest.fn(),
    },
  }) as unknown as RootStore;

describe('CollectionStore', () => {
  beforeEach(() => {
    mockedApiGetJson.mockReset();
    mockedApiSendJson.mockReset();
  });

  it('loads a collection by id', async () => {
    const collection = createCollection({ id: 'summer' });
    mockedApiGetJson.mockResolvedValue(collection);
    const store = new CollectionStore(createRootStoreStub());

    await store.loadCollection('summer');

    expect(mockedApiGetJson).toHaveBeenCalledWith('/v1/collection/summer');
    expect(store.currentCollection).toEqual(collection);
    expect(store.isLoading).toBe(false);
  });

  it('creates a collection and inserts it into auth store', async () => {
    const rootStore = createRootStoreStub();
    const collection = createCollection({ id: 3, name: 'Work' });
    mockedApiSendJson.mockResolvedValue(collection);
    const store = new CollectionStore(rootStore);

    await expect(
      store.createCollection('Work', 'https://example.com/work.jpg'),
    ).resolves.toEqual(collection);

    expect(mockedApiSendJson).toHaveBeenCalledWith('/v1/collection', 'POST', {
      name: 'Work',
      cover_image_url: 'https://example.com/work.jpg',
    });
    expect(rootStore.authStore.insertCollection).toHaveBeenCalledWith(
      collection,
    );
  });

  it('falls back through delete strategies and keeps optimistic delete on recoverable errors', async () => {
    const rootStore = createRootStoreStub();
    mockedApiSendJson
      .mockRejectedValueOnce(new ApiError('Method not allowed', 405, null))
      .mockResolvedValueOnce(null);
    const store = new CollectionStore(rootStore);

    await store.deleteCollections([1]);

    expect(rootStore.authStore.removeCollections).toHaveBeenCalledWith([1]);
    expect(mockedApiSendJson).toHaveBeenNthCalledWith(
      1,
      '/v1/collection/1',
      'DELETE',
    );
    expect(mockedApiSendJson).toHaveBeenNthCalledWith(
      2,
      '/v1/collections',
      'DELETE',
      { collection_ids: [1] },
    );
    expect(rootStore.authStore.setCollections).not.toHaveBeenCalled();
  });

  it('rolls back collection deletion when every strategy fails', async () => {
    const rootStore = createRootStoreStub();
    const store = new CollectionStore(rootStore);
    store.currentCollection = createCollection({ id: 1 });

    mockedApiSendJson.mockRejectedValue(
      new ApiError('Conflict', 409, { message: 'Conflict' }),
    );

    await expect(store.deleteCollections([1])).rejects.toBeInstanceOf(ApiError);
    expect(rootStore.authStore.setCollections).toHaveBeenCalledWith(
      rootStore.authStore.collections,
    );
    expect(store.currentCollection).toEqual(createCollection({ id: 1 }));
  });

  it('removes products from the current collection after API success', async () => {
    mockedApiSendJson.mockResolvedValue(null);
    const store = new CollectionStore(createRootStoreStub());
    store.currentCollection = createCollection({
      id: 'favorites',
      products: [createProductCard({ id: 1 }), createProductCard({ id: 2 })],
    });

    await store.removeProductsFromCollection('favorites', [2]);

    expect(mockedApiSendJson).toHaveBeenCalledWith(
      '/v1/collection/products',
      'DELETE',
      {
        collection_ids: ['favorites'],
        product_ids: [2],
      },
    );
    expect(store.currentCollection.products?.map((product) => product.id)).toEqual([
      1,
    ]);
  });
});
