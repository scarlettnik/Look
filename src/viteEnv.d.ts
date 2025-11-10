/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEV_TELEGRAM_INIT_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.css' {
  const stylesheet: string;
  export default stylesheet;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

interface TelegramWebAppUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebAppInitDataUnsafe {
  user?: TelegramWebAppUser;
  start_param?: string;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: TelegramWebAppInitDataUnsafe;
  ready: () => void;
  expand: () => void;
  disableVerticalSwipes: () => void;
  openLink?: (url: string) => void;
}

interface Window {
  __LOOK_DEV_TELEGRAM_INIT_DATA__?: string;
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
