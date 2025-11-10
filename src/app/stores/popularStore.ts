import { makeAutoObservable, runInAction } from 'mobx';

import { apiGetJson } from '../../lib/apiClient';
import type { ProductCard, ProductCollection } from '../../types/domain';

export class PopularStore {
  globalTrendCollections: ProductCollection[] = [];
  personalTrendCollections: ProductCollection[] = [];
  globalBrandCollections: ProductCollection[] = [];
  personalBrandCollections: ProductCollection[] = [];

  isGlobalTrendsLoading = false;
  isPersonalTrendsLoading = false;
  isGlobalBrandsLoading = false;
  isPersonalBrandsLoading = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get allCollections() {
    return [
      ...this.globalTrendCollections,
      ...this.personalTrendCollections,
      ...this.globalBrandCollections,
      ...this.personalBrandCollections,
    ];
  }

  async fetchGlobalTrends() {
    if (this.globalTrendCollections.length > 0 || this.isGlobalTrendsLoading) {
      return;
    }

    this.isGlobalTrendsLoading = true;

    try {
      const collections = await apiGetJson<ProductCollection[]>('/v1/feature/trends/global');

      runInAction(() => {
        this.globalTrendCollections = collections ?? [];
      });
    } finally {
      runInAction(() => {
        this.isGlobalTrendsLoading = false;
      });
    }
  }

  async fetchPersonalTrends() {
    if (this.personalTrendCollections.length > 0 || this.isPersonalTrendsLoading) {
      return;
    }

    this.isPersonalTrendsLoading = true;

    try {
      const collections = await apiGetJson<ProductCollection[]>('/v1/feature/trends/personal');

      runInAction(() => {
        this.personalTrendCollections = collections ?? [];
      });
    } finally {
      runInAction(() => {
        this.isPersonalTrendsLoading = false;
      });
    }
  }

  async fetchGlobalBrands() {
    if (this.globalBrandCollections.length > 0 || this.isGlobalBrandsLoading) {
      return;
    }

    this.isGlobalBrandsLoading = true;

    try {
      const collections = await apiGetJson<ProductCollection[]>('/v1/feature/brands/global');

      runInAction(() => {
        this.globalBrandCollections = collections ?? [];
      });
    } finally {
      runInAction(() => {
        this.isGlobalBrandsLoading = false;
      });
    }
  }

  async fetchPersonalBrands() {
    if (this.personalBrandCollections.length > 0 || this.isPersonalBrandsLoading) {
      return;
    }

    this.isPersonalBrandsLoading = true;

    try {
      const collections = await apiGetJson<ProductCollection[]>('/v1/feature/brands/personal');

      runInAction(() => {
        this.personalBrandCollections = collections ?? [];
      });
    } finally {
      runInAction(() => {
        this.isPersonalBrandsLoading = false;
      });
    }
  }

  updateProductCollectionStatus(productId: ProductCard['id'], isSaved: boolean) {
    const updateCollections = (collections: ProductCollection[]) =>
      collections.map((collection) => ({
        ...collection,
        products: collection.products?.map((product) =>
          product.id === productId
            ? {
                ...product,
                is_contained_in_user_collections: isSaved,
              }
            : product,
        ),
      }));

    this.globalTrendCollections = updateCollections(this.globalTrendCollections);
    this.personalTrendCollections = updateCollections(this.personalTrendCollections);
    this.globalBrandCollections = updateCollections(this.globalBrandCollections);
    this.personalBrandCollections = updateCollections(this.personalBrandCollections);
  }

  reset() {
    this.globalTrendCollections = [];
    this.personalTrendCollections = [];
    this.globalBrandCollections = [];
    this.personalBrandCollections = [];
    this.isGlobalTrendsLoading = false;
    this.isPersonalTrendsLoading = false;
    this.isGlobalBrandsLoading = false;
    this.isPersonalBrandsLoading = false;
  }
}
