const DEFAULT_DEV_INIT_DATA =
  'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';

const DEV_INIT_DATA_STORAGE_KEY = 'look.dev.telegram.init-data';

const getWindowObject = () => (typeof window === 'undefined' ? null : window);

const getDevelopmentInitData = () => {
  if (!import.meta.env.DEV) {
    return '';
  }

  const currentWindow = getWindowObject();
  const windowInitData = currentWindow?.__LOOK_DEV_TELEGRAM_INIT_DATA__?.trim();
  const storedInitData = currentWindow?.localStorage
    ?.getItem(DEV_INIT_DATA_STORAGE_KEY)
    ?.trim();
  const envInitData = import.meta.env.VITE_DEV_TELEGRAM_INIT_DATA?.trim();

  return windowInitData || storedInitData || envInitData || DEFAULT_DEV_INIT_DATA;
};

type ParsedTelegramUser = TelegramWebAppUser & Record<string, unknown>;

const parseTelegramUser = (
  encodedUser: string | null,
): ParsedTelegramUser | undefined => {
  if (!encodedUser) {
    return undefined;
  }

  try {
    return JSON.parse(encodedUser) as ParsedTelegramUser;
  } catch {
    return undefined;
  }
};

export const parseTelegramInitData = (
  initData: string,
): TelegramWebAppInitDataUnsafe => {
  if (!initData) {
    return {};
  }

  const searchParams = new URLSearchParams(initData);

  return {
    user: parseTelegramUser(searchParams.get('user')),
    start_param: searchParams.get('start_param') ?? undefined,
  };
};

export const getTelegramWebApp = () => getWindowObject()?.Telegram?.WebApp;

export const getTelegramInitData = () =>
  getTelegramWebApp()?.initData || getDevelopmentInitData();

export const getTelegramInitDataUnsafe = () =>
  getTelegramWebApp()?.initDataUnsafe ||
  parseTelegramInitData(getTelegramInitData());

export const getTelegramStartParam = () =>
  getTelegramInitDataUnsafe()?.start_param ?? null;

export const isTelegramEnvironment = () =>
  Boolean(getTelegramInitDataUnsafe()?.user);

const compareTelegramVersions = (currentVersion = '0', minimumVersion: string) => {
  const currentParts = currentVersion.split('.').map((part) => Number(part) || 0);
  const minimumParts = minimumVersion.split('.').map((part) => Number(part) || 0);
  const length = Math.max(currentParts.length, minimumParts.length);

  for (let index = 0; index < length; index += 1) {
    const currentPart = currentParts[index] ?? 0;
    const minimumPart = minimumParts[index] ?? 0;

    if (currentPart > minimumPart) {
      return 1;
    }

    if (currentPart < minimumPart) {
      return -1;
    }
  }

  return 0;
};

export const isTelegramBackButtonSupported = () => {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return false;
  }

  if (webApp.isVersionAtLeast) {
    return webApp.isVersionAtLeast('6.1');
  }

  return compareTelegramVersions(webApp.version, '6.1') >= 0;
};

export const ensureTelegramWebApp = () => {
  const currentWindow = getWindowObject();

  if (!currentWindow) {
    return null;
  }

  const currentWebApp = currentWindow.Telegram?.WebApp;

  if (currentWebApp?.initDataUnsafe?.user) {
    return currentWebApp;
  }

  const initData = currentWebApp?.initData || getDevelopmentInitData();
  const initDataUnsafe =
    currentWebApp?.initDataUnsafe || parseTelegramInitData(initData);

  const browserTestWebApp: TelegramWebApp = {
    version: currentWebApp?.version || '6.0',
    initData,
    initDataUnsafe,
    ready: currentWebApp?.ready || (() => undefined),
    expand: currentWebApp?.expand || (() => undefined),
    disableVerticalSwipes:
      currentWebApp?.disableVerticalSwipes || (() => undefined),
    openLink:
      currentWebApp?.openLink ||
      ((url: string) => {
        currentWindow.open(url, '_blank', 'noopener,noreferrer');
      }),
    isVersionAtLeast:
      currentWebApp?.isVersionAtLeast ||
      ((version: string) =>
        compareTelegramVersions(currentWebApp?.version || '6.0', version) >= 0),
  };

  currentWindow.Telegram = {
    ...(currentWindow.Telegram || {}),
    WebApp: browserTestWebApp,
  };

  return browserTestWebApp;
};
