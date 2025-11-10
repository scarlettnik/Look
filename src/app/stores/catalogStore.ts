import { makeAutoObservable, runInAction } from 'mobx';

import { apiSendJson } from '../../lib/apiClient';
import type {
  CatalogFilters,
  CatalogSearchRequest,
  ProductCard,
  SwipeHistoryEntry,
} from '../../types/domain';

const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  sizes: [],
  categories: [],
  colors: [],
  brands: [],
  min_price: null,
  max_price: null,
};

const CATALOG_PAGE_SIZE = 10;

const createClientKey = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

export class CatalogStore {
  cards: ProductCard[] = [];
  basket: ProductCard[] = [];
  swipeHistory: SwipeHistoryEntry[] = [];
  isLoading = true;
  isFetching = false;
  isSearching = false;
  isAddingCards = false;
  hasMore = true;
  error: string | null = null;
  currentSearchQuery: string | null = null;
  lastSearchQuery: string | null = null;
  currentOffset = 0;
  currentFilters: CatalogFilters = { ...DEFAULT_CATALOG_FILTERS };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getCurrentFilters() {
    return this.currentFilters;
  }

  async fetchCards(reset = false) {
    if ((!this.hasMore && !reset) || this.isFetching) {
      return;
    }

    this.isFetching = true;
    this.error = null;

    if (reset) {
      this.isLoading = true;
      this.currentOffset = 0;
      this.cards = [];
      this.hasMore = true;
    }

    try {
      const searchParams = new URLSearchParams({
        offset: String(this.currentOffset),
        limit: String(CATALOG_PAGE_SIZE),
      });

      const nextCards = await apiSendJson<ProductCard[]>(
        `/v1/catalog/search?${searchParams.toString()}`,
        'POST',
        {
          sizes: this.currentFilters.sizes,
          query: this.currentSearchQuery,
          categories: this.currentFilters.categories,
          colors: this.currentFilters.colors,
          brands: this.currentFilters.brands,
          min_price: this.currentFilters.min_price,
          max_price: this.currentFilters.max_price,
        },
      );

      runInAction(() => {
        const preparedCards = (nextCards ?? []).map((card) => ({
          ...card,
          _pending: true,
          _key: createClientKey(),
        }));

        this.hasMore = preparedCards.length >= CATALOG_PAGE_SIZE;
        this.currentOffset += preparedCards.length;
        this.cards = reset ? preparedCards : [...this.cards, ...preparedCards];
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load cards';
      });
    } finally {
      runInAction(() => {
        this.isFetching = false;
        this.isLoading = false;
        this.isAddingCards = false;
      });
    }
  }

  async fetchCardsWithSearch(searchRequest: CatalogSearchRequest) {
    runInAction(() => {
      this.currentSearchQuery = searchRequest.query?.trim() || null;
      this.isSearching = Boolean(this.currentSearchQuery);
    });

    await this.fetchCards(true);
  }

  async resetSearch() {
    runInAction(() => {
      this.currentSearchQuery = null;
      this.isSearching = false;
    });

    await this.fetchCards(true);
  }

  async applyFilters(nextFilters: CatalogFilters) {
    runInAction(() => {
      this.currentFilters = {
        ...DEFAULT_CATALOG_FILTERS,
        ...nextFilters,
      };
    });

    await this.fetchCards(true);
  }

  async resetFilters() {
    runInAction(() => {
      this.currentFilters = { ...DEFAULT_CATALOG_FILTERS };
    });

    await this.fetchCards(true);
  }

  setLastSearchQuery(query: string) {
    this.lastSearchQuery = query;
  }

  clearLastSearchQuery() {
    this.lastSearchQuery = null;
  }

  updateProductCollectionStatus(productId: ProductCard['id'], isSaved: boolean) {
    this.cards = this.cards.map((card) =>
      card.id === productId
        ? {
            ...card,
            is_contained_in_user_collections: isSaved,
          }
        : card,
    );
  }

  handleSwipe(direction: SwipeHistoryEntry['direction'], card: ProductCard) {
    this.swipeHistory = [{ direction, card }, ...this.swipeHistory];
    this.cards = this.cards.filter((currentCard) => currentCard.id !== card.id);

    if (direction === 'up') {
      this.basket = [...this.basket, card];
    }

    if (this.cards.length < 7 && this.hasMore && !this.isFetching) {
      this.isAddingCards = true;
      void this.fetchCards();
    }
  }

  undoSwipe() {
    const lastAction = this.swipeHistory[0];

    if (!lastAction) {
      return;
    }

    const { direction, card } = lastAction;
    const restoredCard: ProductCard = {
      ...card,
      _pending: true,
      _key: createClientKey(),
      style: {
        opacity: 0,
        zIndex: 100001,
      },
    };

    this.cards = [restoredCard, ...this.cards];
    this.swipeHistory = this.swipeHistory.slice(1);

    if (direction === 'up') {
      this.basket = this.basket.filter(
        (basketCard) => basketCard.id !== card.id,
      );
    }

    setTimeout(() => {
      runInAction(() => {
        this.cards = this.cards.map((currentCard) =>
          currentCard.id === restoredCard.id
            ? {
                ...currentCard,
                _pending: false,
                style: {
                  transform: 'translate(0, 0) rotate(0deg)',
                  opacity: 1,
                  transition: 'all 200ms ease-out',
                },
              }
            : currentCard,
        );
      });
    }, 50);
  }

  reset() {
    this.cards = [];
    this.basket = [];
    this.swipeHistory = [];
    this.isLoading = true;
    this.isFetching = false;
    this.isSearching = false;
    this.isAddingCards = false;
    this.hasMore = true;
    this.error = null;
    this.currentSearchQuery = null;
    this.lastSearchQuery = null;
    this.currentOffset = 0;
    this.currentFilters = { ...DEFAULT_CATALOG_FILTERS };
  }
}
