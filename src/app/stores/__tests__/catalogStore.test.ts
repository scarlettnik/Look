import { CatalogStore } from '../catalogStore';
import { apiSendJson } from '../../../lib/apiClient';
import { createProductCard, createProductCards } from '../../../test/factories';

jest.mock('../../../lib/apiClient', () => ({
  apiSendJson: jest.fn(),
}));

const mockedApiSendJson = jest.mocked(apiSendJson);

describe('CatalogStore', () => {
  beforeEach(() => {
    mockedApiSendJson.mockReset();
    jest.useRealTimers();
  });

  it('fetches the first catalog page and prepares cards for rendering', async () => {
    mockedApiSendJson.mockResolvedValue(createProductCards(10));
    const store = new CatalogStore();

    await store.fetchCards(true);

    expect(mockedApiSendJson).toHaveBeenCalledWith(
      '/v1/catalog/search?offset=0&limit=10',
      'POST',
      {
        sizes: [],
        query: null,
        categories: [],
        colors: [],
        brands: [],
        min_price: null,
        max_price: null,
      },
    );
    expect(store.cards).toHaveLength(10);
    expect(store.cards[0]).toEqual(
      expect.objectContaining({
        id: 1,
        _pending: true,
      }),
    );
    expect(store.cards[0]._key).toEqual(expect.any(String));
    expect(store.currentOffset).toBe(10);
    expect(store.hasMore).toBe(true);
    expect(store.isLoading).toBe(false);
  });

  it('applies search and filters as reset requests', async () => {
    mockedApiSendJson
      .mockResolvedValueOnce([createProductCard({ id: 'search-result' })])
      .mockResolvedValueOnce([createProductCard({ id: 'filtered-result' })]);
    const store = new CatalogStore();

    await store.fetchCardsWithSearch({ query: '  жакет  ' });
    await store.applyFilters({
      sizes: ['M'],
      categories: ['jacket'],
      colors: ['black'],
      brands: ['Zara'],
      min_price: 1000,
      max_price: 9000,
    });

    expect(store.currentSearchQuery).toBe('жакет');
    expect(store.isSearching).toBe(true);
    expect(mockedApiSendJson).toHaveBeenNthCalledWith(
      2,
      '/v1/catalog/search?offset=0&limit=10',
      'POST',
      {
        sizes: ['M'],
        query: 'жакет',
        categories: ['jacket'],
        colors: ['black'],
        brands: ['Zara'],
        min_price: 1000,
        max_price: 9000,
      },
    );
  });

  it('stores fetch errors and clears loading flags', async () => {
    mockedApiSendJson.mockRejectedValue(new Error('Network is down'));
    const store = new CatalogStore();

    await store.fetchCards(true);

    expect(store.error).toBe('Network is down');
    expect(store.isFetching).toBe(false);
    expect(store.isLoading).toBe(false);
  });

  it('records swipe history, adds upward swipes to basket and preloads more cards', async () => {
    mockedApiSendJson.mockResolvedValue([createProductCard({ id: 20 })]);
    const store = new CatalogStore();
    const firstCard = createProductCard({ id: 1 });

    store.cards = [
      firstCard,
      createProductCard({ id: 2 }),
      createProductCard({ id: 3 }),
    ];
    store.hasMore = true;
    store.isLoading = false;

    store.handleSwipe('up', firstCard);

    expect(store.cards.map((card) => card.id)).toEqual([2, 3]);
    expect(store.basket).toEqual([firstCard]);
    expect(store.swipeHistory[0]).toEqual({
      direction: 'up',
      card: firstCard,
    });
    expect(store.isAddingCards).toBe(true);

    await Promise.resolve();

    expect(mockedApiSendJson).toHaveBeenCalledWith(
      '/v1/catalog/search?offset=0&limit=10',
      'POST',
      expect.objectContaining({
        query: null,
      }),
    );
    expect(store.cards.map((card) => card.id)).toEqual([2, 3, 20]);
  });

  it('restores the last swiped card and removes it from basket on undo', () => {
    jest.useFakeTimers();
    const store = new CatalogStore();
    const card = createProductCard({ id: 7 });

    store.cards = [createProductCard({ id: 8 })];
    store.basket = [card];
    store.swipeHistory = [{ direction: 'up', card }];

    store.undoSwipe();

    expect(store.cards[0]).toEqual(
      expect.objectContaining({
        id: 7,
        _pending: true,
        style: expect.objectContaining({ opacity: 0 }),
      }),
    );
    expect(store.basket).toEqual([]);
    expect(store.swipeHistory).toEqual([]);

    jest.advanceTimersByTime(50);

    expect(store.cards[0].style).toEqual(
      expect.objectContaining({
        opacity: 1,
        transition: 'all 200ms ease-out',
      }),
    );
  });
});
