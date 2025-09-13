import { makeAutoObservable, flow, runInAction } from "mobx";
import { AUTH_TOKEN } from "../constants.js";

class CatalogStore {
    cards = [];
    basket = [];
    loading = true;
    error = null;
    swipeHistory = [];
    isFetching = false;
    hasMore = true;
    authToken = AUTH_TOKEN;
    currentSearchQuery = '';
    currentOffset = 0;
    limit = 20;
    currentFilters = {
        sizes: [],
        categories: [],
        colors: [],
        brands: [],
        min_price: null,
        max_price: null
    };
    lastSearchQuery = null;
    // Добавляем флаг для отслеживания состояния добавления карточек
    isAddingCards = false;

    constructor() {
        makeAutoObservable(this);
        this.fetchCards(true);
    }

    getUniqueKey = () => {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    getAuthHeaders = () => ({
        "ngrok-skip-browser-warning": true,
        'Content-Type': 'application/json',
        'Authorization': `tma ${this.authToken}`
    });
    setLastSearchQuery = (query) => {
        this.lastSearchQuery = query;
    };

    getCurrentFilters = () => {
        return this.lastAppliedFilters || this.currentFilters;
    };

    clearLastSearchQuery = () => {
        this.lastSearchQuery = null;
    };

    fetchCards = flow(function* (initialLoad = false) {
        if (!this.hasMore || this.isFetching || this.isAddingCards) return;

        try {
            this.isFetching = true;
            this.isAddingCards = true; // Устанавливаем флаг добавления карточек

            if (initialLoad) {
                this.loading = true;
                this.currentOffset = 0;
                this.cards = [];
            }

            const url = new URL('https://api.lookvogue.ru/v1/catalog/search');
            url.searchParams.append('offset', this.currentOffset);
            url.searchParams.append('limit', this.limit);
            const requestBody = {
                sizes: this.currentFilters.sizes,
                query: this.currentSearchQuery,
                categories: this.currentFilters.categories,
                colors: this.currentFilters.colors,
                brands: this.currentFilters.brands,
                min_price: this.currentFilters.min_price,
                max_price: this.currentFilters.max_price,
            };

            const response = yield fetch(url.toString(), {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newCards = yield response.json();
            this.hasMore = newCards.length >= this.limit;
            this.currentOffset += newCards.length;

            const cardsWithKeys = newCards.map(card => ({
                ...card,
                _key: this.getUniqueKey(),
                _pending: false
            }));

            // Используем runInAction для batch updates
            runInAction(() => {
                if (initialLoad) {
                    this.cards = cardsWithKeys;
                } else {
                    // Добавляем новые карточки с небольшой задержкой для стабильности
                    this.cards = [...this.cards, ...cardsWithKeys];
                }
            });

        } catch (err) {
            this.error = err.message;
            console.error("Card loading error:", err);
        } finally {
            runInAction(() => {
                this.isFetching = false;
                this.loading = false;
                // Сбрасываем флаг после небольшой задержки
                setTimeout(() => {
                    runInAction(() => {
                        this.isAddingCards = false;
                    });
                }, 100);
            });
        }
    });
    fetchCardsWithSearch = flow(function* (searchRequest) {
        this.currentSearchQuery = searchRequest.query?.trim() || null;
        this.hasMore = true;
        yield this.fetchCards(true);
    });

    resetSearch = flow(function* () {
        this.currentSearchQuery = null;
        this.hasMore = true;
        yield this.fetchCards(true);
    });

    applyFilters = flow(function* (newFilters) {
        this.currentFilters = {
            ...this.currentFilters,
            ...newFilters
        };
        this.hasMore = true;
        yield this.fetchCards(true);
    });

    resetFilters = flow(function* () {
        this.currentFilters = {
            categories: [],
            colors: [],
            brands: [],
            min_price: null,
            max_price: null
        };
        this.hasMore = true;
        yield this.fetchCards(true);
    });

    handleSwipe = (direction, card) => {
        if (direction === 'down' || this.isAddingCards) return;

        this.swipeHistory = [{ direction, card }, ...this.swipeHistory];

        const cardIndex = this.cards.findIndex(c => c._key === card._key);
        if (cardIndex !== -1) {
            runInAction(() => {
                this.cards.splice(cardIndex, 1);
            });
        }

        if (direction === 'up') {
            this.basket = [...this.basket, card];
        }

        if (this.cards.length < 7 && this.hasMore && !this.isFetching && !this.isAddingCards) {
            this.fetchCards();
        }
    };


    undoSwipe = () => {
        if (this.swipeHistory.length === 0) return;

        const lastAction = this.swipeHistory[0];
        const { direction, card } = lastAction;

        const restoredCard = {
            ...card,
            _key: card._key
        };

        // Добавляем карточку в начало массива
        this.cards.unshift(restoredCard);
        this.swipeHistory = this.swipeHistory.slice(1);

        if (direction === 'up') {
            this.basket = this.basket.filter(c => c._key !== card._key);
        }
    };
}

export default CatalogStore;