import { makeAutoObservable, runInAction } from 'mobx';

import { apiSendJson } from '../../lib/apiClient';
import { getTelegramInitData, getTelegramInitDataUnsafe } from '../../lib/telegramWebApp';
import type { AuthUser, ProductCollection, UserPreferences } from '../../types/domain';
import { insertUserCollection } from '../../lib/systemCollections';
import type { RootStore } from './rootStore';

const getInitialTelegramUser = (): AuthUser | null => {
  const telegramUser = getTelegramInitDataUnsafe()?.user;

  if (!telegramUser) {
    return null;
  }

  return { ...telegramUser };
};

export class AuthStore {
  private readonly rootStore: RootStore;

  user: AuthUser | null = getInitialTelegramUser();
  isLoading = false;
  error: string | null = null;
  hasLoaded = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable<AuthStore, 'rootStore'>(this, {
      rootStore: false,
    }, {
      autoBind: true,
    });
  }

  get collections(): ProductCollection[] {
    return this.user?.collections ?? [];
  }

  get preferences(): UserPreferences | null {
    return this.user?.preferences ?? null;
  }

  get isAuthenticated() {
    return Boolean(this.user);
  }

  async initialize() {
    if (this.hasLoaded || this.isLoading) {
      return;
    }

    const telegramInitData = getTelegramInitData();

    if (!telegramInitData) {
      runInAction(() => {
        this.hasLoaded = true;
      });
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const user = await apiSendJson<AuthUser>('/v1/auth/init-data', 'POST');

      runInAction(() => {
        this.user = {
          ...getInitialTelegramUser(),
          ...user,
        };
        this.hasLoaded = true;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Authentication failed';
        this.hasLoaded = true;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async savePreferences(preferences: Partial<UserPreferences>) {
    await apiSendJson('/v1/user', 'PATCH', {
      preferences,
    });

    runInAction(() => {
      this.updatePreferences(preferences);
    });
  }

  async deleteAccount() {
    await apiSendJson('/v1/user', 'DELETE');

    runInAction(() => {
      this.user = null;
      this.error = null;
      this.hasLoaded = true;
      this.rootStore.collectionStore.reset();
      this.rootStore.catalogStore.reset();
      this.rootStore.catalogMetadataStore.reset();
      this.rootStore.popularStore.reset();
    });
  }

  updatePreferences(preferences: Partial<UserPreferences>) {
    const currentPreferences = this.user?.preferences ?? {};

    this.user = {
      ...(this.user ?? {}),
      preferences: {
        ...currentPreferences,
        ...preferences,
      },
    };
  }

  setCollections(collections: ProductCollection[]) {
    if (!this.user) {
      this.user = {
        collections,
      };
      return;
    }

    this.user = {
      ...this.user,
      collections,
    };
  }

  insertCollection(collection: ProductCollection) {
    this.setCollections(insertUserCollection(this.collections, collection));
  }

  updateCollection(collectionId: ProductCollection['id'], updates: Partial<ProductCollection>) {
    this.setCollections(
      this.collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              ...updates,
            }
          : collection,
      ),
    );
  }

  removeCollections(collectionIds: Array<ProductCollection['id']>) {
    const collectionIdsSet = new Set(collectionIds.map((collectionId) => String(collectionId)));

    this.setCollections(
      this.collections.filter(
        (collection) => !collectionIdsSet.has(String(collection.id)),
      ),
    );
  }
}
