import { AuthStore } from '../authStore';
import { CatalogMetadataStore } from '../catalogMetadataStore';
import { CatalogStore } from '../catalogStore';
import { CollectionStore } from '../collectionStore';
import { PopularStore } from '../popularStore';
import { RootStore } from '../rootStore';

jest.mock('../../../lib/telegramWebApp', () => ({
  getTelegramInitData: jest.fn(() => ''),
  getTelegramInitDataUnsafe: jest.fn(() => ({})),
}));

describe('RootStore', () => {
  it('wires feature stores into a single MobX root', () => {
    const rootStore = new RootStore();

    expect(rootStore.authStore).toBeInstanceOf(AuthStore);
    expect(rootStore.catalogStore).toBeInstanceOf(CatalogStore);
    expect(rootStore.catalogMetadataStore).toBeInstanceOf(CatalogMetadataStore);
    expect(rootStore.collectionStore).toBeInstanceOf(CollectionStore);
    expect(rootStore.popularStore).toBeInstanceOf(PopularStore);
  });
});
