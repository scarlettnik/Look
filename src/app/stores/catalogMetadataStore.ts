import { makeAutoObservable, runInAction } from 'mobx';

import { apiGetJson } from '../../lib/apiClient';
import type { CatalogMetadata } from '../../types/domain';

const EMPTY_METADATA: CatalogMetadata = {
  brands: [],
  categories: [],
  colors: {},
};

export class CatalogMetadataStore {
  metadata: CatalogMetadata = EMPTY_METADATA;
  isLoading = false;
  error: string | null = null;
  hasLoaded = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async ensureLoaded() {
    if (this.hasLoaded || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const metadata = await apiGetJson<CatalogMetadata>('/v1/catalog/search/meta');

      runInAction(() => {
        this.metadata = {
          brands: metadata?.brands ?? [],
          categories: metadata?.categories ?? [],
          colors: metadata?.colors ?? {},
        };
        this.hasLoaded = true;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load metadata';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  reset() {
    this.metadata = EMPTY_METADATA;
    this.isLoading = false;
    this.error = null;
    this.hasLoaded = false;
  }
}
