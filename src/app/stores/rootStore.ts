import { AuthStore } from './authStore';
import { CatalogMetadataStore } from './catalogMetadataStore';
import { CatalogStore } from './catalogStore';
import { CollectionStore } from './collectionStore';
import { PopularStore } from './popularStore';

export class RootStore {
  readonly authStore: AuthStore;
  readonly catalogMetadataStore: CatalogMetadataStore;
  readonly catalogStore: CatalogStore;
  readonly collectionStore: CollectionStore;
  readonly popularStore: PopularStore;

  constructor() {
    this.catalogStore = new CatalogStore();
    this.catalogMetadataStore = new CatalogMetadataStore();
    this.popularStore = new PopularStore();
    this.authStore = new AuthStore(this);
    this.collectionStore = new CollectionStore(this);
  }
}
