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

  return windowInitData || storedInitData || envInitData || '';
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
