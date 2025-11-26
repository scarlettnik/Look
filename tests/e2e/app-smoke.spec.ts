import { expect, test, type Page } from '@playwright/test';

const imageDataUrl =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420"><rect width="320" height="420" fill="#d8c7a6"/><text x="32" y="210" font-size="28" fill="#1d1d1d">LOOK</text></svg>',
  );

const createProduct = (id: number, name: string, brand = 'Look') => ({
  id,
  name,
  brand,
  type: 'jacket',
  price: 12000,
  discount_price: null,
  description: `${name} description`,
  image_urls: [imageDataUrl],
  sizes: ['M'],
  color_name: 'black',
  is_contained_in_user_collections: false,
});

const createCollection = (id: string, name: string) => ({
  id,
  name,
  cover_image_url: imageDataUrl,
  products: [createProduct(100 + id.length, `${name} product`)],
});

const installTelegramWebApp = async (page: Page) => {
  await page.addInitScript(() => {
    const initData =
      'user=%7B%22id%22%3A42%2C%22first_name%22%3A%22Sofia%22%2C%22username%22%3A%22scarlettnik%22%7D&auth_date=1763200000&hash=test';
    const initDataUnsafe = {
      user: {
        id: 42,
        first_name: 'Sofia',
        username: 'scarlettnik',
      },
    };
    const webApp = {
      initData,
      initDataUnsafe,
      ready: () => undefined,
      expand: () => undefined,
      disableVerticalSwipes: () => undefined,
      openLink: () => undefined,
    };
    const telegram: { WebApp?: typeof webApp } = {};

    Object.defineProperty(telegram, 'WebApp', {
      configurable: true,
      get: () => webApp,
      set: (nextWebApp) => {
        Object.assign(webApp, nextWebApp || {}, {
          initData,
          initDataUnsafe,
        });
      },
    });

    Object.defineProperty(window, 'Telegram', {
      configurable: true,
      get: () => telegram,
      set: (nextTelegram) => {
        if (nextTelegram?.WebApp) {
          Object.assign(webApp, nextTelegram.WebApp, {
            initData,
            initDataUnsafe,
          });
        }
      },
    });
    window.__LOOK_DEV_TELEGRAM_INIT_DATA__ = initData;
  });
};

const mockLookApi = async (
  page: Page,
  options: { completeOnboarding?: boolean } = {},
) => {
  const searchRequests: unknown[] = [];
  const completeOnboarding = options.completeOnboarding ?? true;

  await page.route('**/v1/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    const fulfillJson = (body: unknown, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });

    if (path === '/v1/auth/init-data') {
      await fulfillJson({
        id: 42,
        first_name: 'Sofia',
        username: 'scarlettnik',
        preferences: {
          complete_onboarding: completeOnboarding,
          age: 25,
          gender: 'female',
          styles: ['minimalist'],
        },
        collections: [createCollection('favorites', 'Избранное')],
      });
      return;
    }

    if (path === '/v1/catalog/search/meta') {
      await fulfillJson({
        brands: ['Zara', 'Mango', 'Studio'],
        categories: ['jacket', 'dress', 'shoes', 'bag', 'coat'],
        colors: {
          black: '#000000',
          beige: '#d8c7a6',
        },
      });
      return;
    }

    if (path === '/v1/catalog/search/suggestions') {
      await fulfillJson(['жакет', 'платье']);
      return;
    }

    if (path === '/v1/catalog/search') {
      const body = request.postDataJSON() as {
        brands?: string[];
        query?: string | null;
      };
      searchRequests.push(body);

      if (body.brands?.includes('Zara')) {
        await fulfillJson([createProduct(22, 'Filtered Zara jacket', 'Zara')]);
        return;
      }

      if (body.query) {
        await fulfillJson([createProduct(21, 'Search result jacket', 'Studio')]);
        return;
      }

      await fulfillJson([
        createProduct(1, 'Silk blazer', 'Look'),
        createProduct(2, 'Evening dress', 'Mango'),
        createProduct(3, 'Leather shoes', 'Studio'),
      ]);
      return;
    }

    if (path === '/v1/feature/trends/global') {
      await fulfillJson([createCollection('monochrome', 'Monochrome Trend')]);
      return;
    }

    if (path === '/v1/feature/trends/personal') {
      await fulfillJson([createCollection('capsule', 'Capsule Picks')]);
      return;
    }

    if (path === '/v1/feature/brands/global') {
      await fulfillJson([createCollection('zara', 'Zara')]);
      return;
    }

    if (path === '/v1/feature/brands/personal') {
      await fulfillJson([createCollection('mango', 'Mango')]);
      return;
    }

    if (path.startsWith('/v1/interaction/product/') || path === '/v1/user') {
      await fulfillJson({ ok: true });
      return;
    }

    await fulfillJson({ message: `Unhandled test route: ${path}` }, 404);
  });

  return { searchRequests };
};

test.beforeEach(async ({ page }) => {
  await installTelegramWebApp(page);
});

test('shows the onboarding flow for a new Telegram user @smoke', async ({
  page,
}) => {
  await mockLookApi(page, { completeOnboarding: false });

  await page.goto('/');

  await expect(page.getByText(/Добро пожаловать/)).toBeVisible();
  await page.getByRole('button', { name: /Начать/ }).click();
  await expect(page.getByText('Выберите пол и возраст')).toBeVisible();
});

test('loads product cards, searches and applies a brand filter @smoke', async ({
  page,
}) => {
  const api = await mockLookApi(page);

  await page.goto('/cards');

  await expect(page.getByText('Silk blazer')).toBeVisible();

  await page.getByPlaceholder('Стиль, повод, настроение').fill('жакет');
  await page.getByRole('button', { name: 'Начать поиск' }).click();

  await expect(page.getByText('Search result jacket')).toBeVisible();
  expect(api.searchRequests).toContainEqual(
    expect.objectContaining({ query: 'жакет' }),
  );

  await page.getByRole('button', { name: 'Бренд' }).click();
  await page.getByRole('button', { name: 'Zara' }).click();
  await page.getByRole('button', { name: 'Показать' }).click();

  await expect(page.getByText('Filtered Zara jacket')).toBeVisible();
  expect(api.searchRequests).toContainEqual(
    expect.objectContaining({ brands: ['Zara'] }),
  );
});

test('opens trends and switches to brands @smoke', async ({ page }) => {
  await mockLookApi(page);

  await page.goto('/trands');

  await expect(page.getByText('Тренды сезона')).toBeVisible();
  await expect(page.getByText('Monochrome Trend')).toBeVisible();

  await page.getByRole('button', { name: 'Бренды' }).click();

  await expect(page.getByText('Популярные бренды')).toBeVisible();
  await expect(page.getByText('Zara')).toBeVisible();
});
