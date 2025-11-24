import { AuthStore } from '../authStore';
import type { RootStore } from '../rootStore';
import { apiSendJson } from '../../../lib/apiClient';
import {
  getTelegramInitData,
  getTelegramInitDataUnsafe,
} from '../../../lib/telegramWebApp';

jest.mock('../../../lib/apiClient', () => ({
  apiSendJson: jest.fn(),
}));

jest.mock('../../../lib/telegramWebApp', () => ({
  getTelegramInitData: jest.fn(),
  getTelegramInitDataUnsafe: jest.fn(),
}));

const mockedApiSendJson = jest.mocked(apiSendJson);
const mockedGetTelegramInitData = jest.mocked(getTelegramInitData);
const mockedGetTelegramInitDataUnsafe = jest.mocked(getTelegramInitDataUnsafe);

const createRootStoreStub = () =>
  ({
    catalogStore: { reset: jest.fn() },
    catalogMetadataStore: { reset: jest.fn() },
    collectionStore: { reset: jest.fn() },
    popularStore: { reset: jest.fn() },
  }) as unknown as RootStore;

describe('AuthStore', () => {
  beforeEach(() => {
    mockedApiSendJson.mockReset();
    mockedGetTelegramInitData.mockReturnValue('');
    mockedGetTelegramInitDataUnsafe.mockReturnValue({});
  });

  it('skips API authentication in local flow without initData', async () => {
    const store = new AuthStore(createRootStoreStub());

    await store.initialize();

    expect(mockedApiSendJson).not.toHaveBeenCalled();
    expect(store.hasLoaded).toBe(true);
    expect(store.isAuthenticated).toBe(false);
  });

  it('authenticates with Telegram initData and merges Telegram profile with API user', async () => {
    mockedGetTelegramInitData.mockReturnValue('signed-init-data');
    mockedGetTelegramInitDataUnsafe.mockReturnValue({
      user: {
        id: 12,
        first_name: 'Sofia',
        username: 'scarlettnik',
      },
    });
    mockedApiSendJson.mockResolvedValue({
      preferences: { complete_onboarding: true },
      collections: [],
    });

    const store = new AuthStore(createRootStoreStub());

    await store.initialize();

    expect(mockedApiSendJson).toHaveBeenCalledWith(
      '/v1/auth/init-data',
      'POST',
    );
    expect(store.user).toEqual({
      id: 12,
      first_name: 'Sofia',
      username: 'scarlettnik',
      preferences: { complete_onboarding: true },
      collections: [],
    });
    expect(store.hasLoaded).toBe(true);
    expect(store.isLoading).toBe(false);
  });

  it('saves preferences through the API and updates local user state', async () => {
    mockedApiSendJson.mockResolvedValue(null);
    const store = new AuthStore(createRootStoreStub());
    store.user = { id: 1, preferences: { age: 25 } };

    await store.savePreferences({ styles: ['minimalist'] });

    expect(mockedApiSendJson).toHaveBeenCalledWith('/v1/user', 'PATCH', {
      preferences: { styles: ['minimalist'] },
    });
    expect(store.preferences).toEqual({
      age: 25,
      styles: ['minimalist'],
    });
  });

  it('clears dependent stores after account deletion', async () => {
    mockedApiSendJson.mockResolvedValue(null);
    const rootStore = createRootStoreStub();
    const store = new AuthStore(rootStore);
    store.user = { id: 1 };

    await store.deleteAccount();

    expect(mockedApiSendJson).toHaveBeenCalledWith('/v1/user', 'DELETE');
    expect(store.user).toBeNull();
    expect(rootStore.collectionStore.reset).toHaveBeenCalled();
    expect(rootStore.catalogStore.reset).toHaveBeenCalled();
    expect(rootStore.catalogMetadataStore.reset).toHaveBeenCalled();
    expect(rootStore.popularStore.reset).toHaveBeenCalled();
  });
});
