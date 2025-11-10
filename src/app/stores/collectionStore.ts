import { makeAutoObservable, runInAction } from 'mobx';

import { ApiError, apiGetJson, apiSendJson } from '../../lib/apiClient';
import type { EntityId, ProductCollection } from '../../types/domain';
import type { RootStore } from './rootStore';

export class CollectionStore {
  private readonly rootStore: RootStore;

  currentCollection: ProductCollection | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable<CollectionStore, 'rootStore'>(this, {
      rootStore: false,
    }, {
      autoBind: true,
    });
  }

  async loadCollection(collectionId?: EntityId | null) {
    if (collectionId == null) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const collection = await apiGetJson<ProductCollection>(
        `/v1/collection/${collectionId}`,
      );

      runInAction(() => {
        this.currentCollection = collection;
      });
    } catch (error) {
      runInAction(() => {
        this.currentCollection = null;
        this.error = error instanceof Error ? error.message : 'Failed to load collection';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createCollection(name: string, coverImageUrl: string) {
    const collection = await apiSendJson<ProductCollection>('/v1/collection', 'POST', {
      name,
      cover_image_url: coverImageUrl,
    });

    runInAction(() => {
      this.rootStore.authStore.insertCollection(collection);
    });

    return collection;
  }

  async updateCollection(
    collectionId: EntityId,
    updates: Pick<ProductCollection, 'name' | 'cover_image_url'>,
  ) {
    const collection = await apiSendJson<ProductCollection | null>(
      `/v1/collection/${collectionId}`,
      'PATCH',
      updates,
    );

    const nextCollectionState = collection ?? {
      id: collectionId,
      ...updates,
    };

    runInAction(() => {
      this.rootStore.authStore.updateCollection(collectionId, nextCollectionState);

      if (this.currentCollection?.id === collectionId) {
        this.currentCollection = {
          ...this.currentCollection,
          ...nextCollectionState,
        };
      }
    });

    return nextCollectionState;
  }

  async deleteCollections(collectionIds: EntityId[]) {
    const previousCollections = [...this.rootStore.authStore.collections];
    const previousCurrentCollection = this.currentCollection;

    runInAction(() => {
      this.rootStore.authStore.removeCollections(collectionIds);

      if (
        this.currentCollection &&
        collectionIds.some(
          (collectionId) => String(collectionId) === String(this.currentCollection?.id),
        )
      ) {
        this.currentCollection = null;
      }
    });

    const deleteStrategies = [
      async () => {
        await Promise.all(
          collectionIds.map((collectionId) =>
            apiSendJson(`/v1/collection/${collectionId}`, 'DELETE'),
          ),
        );
      },
      () => apiSendJson('/v1/collections', 'DELETE', { collection_ids: collectionIds }),
      () => apiSendJson('/v1/collections', 'DELETE', collectionIds),
      () => apiSendJson('/v1/collections', 'DELETE', { ids: collectionIds }),
    ] as const;

    let lastError: unknown = null;

    for (const deleteStrategy of deleteStrategies) {
      try {
        await deleteStrategy();
        return;
      } catch (error) {
        lastError = error;

        if (!(error instanceof ApiError) || ![400, 404, 405, 409, 415, 422].includes(error.status)) {
          break;
        }
      }
    }

    runInAction(() => {
      this.rootStore.authStore.setCollections(previousCollections);
      this.currentCollection = previousCurrentCollection;
    });

    throw lastError;
  }

  async removeProductsFromCollection(
    collectionId: EntityId,
    productIds: EntityId[],
  ) {
    await apiSendJson('/v1/collection/products', 'DELETE', {
      collection_ids: [collectionId],
      product_ids: productIds,
    });

    runInAction(() => {
      if (this.currentCollection?.id === collectionId) {
        this.currentCollection = {
          ...this.currentCollection,
          products: this.currentCollection.products?.filter(
            (product) => !productIds.includes(product.id),
          ),
        };
      }
    });
  }

  updateCurrentCollectionProductStatus(productId: EntityId, isSaved: boolean) {
    if (!this.currentCollection?.products) {
      return;
    }

    this.currentCollection = {
      ...this.currentCollection,
      products: this.currentCollection.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              is_contained_in_user_collections: isSaved,
            }
          : product,
      ),
    };
  }

  reset() {
    this.currentCollection = null;
    this.isLoading = false;
    this.error = null;
  }
}
