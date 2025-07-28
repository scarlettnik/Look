import { makeAutoObservable, flow } from "mobx";
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
    currentSearchQuery = null;
    currentOffset = 0; // Добавляем offset для пагинации
    limit = 10; // Лимит карточек за один запрос

    constructor() {
        makeAutoObservable(this);
        this.fetchCards(true); // initial load
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

    fetchCards = flow(function* (initialLoad = false) {
        if (!this.hasMore || this.isFetching) return;

        try {
            this.isFetching = true;
            if (initialLoad) {
                this.loading = true;
                this.currentOffset = 0;
                this.cards = [];
            }

            // Формируем URL с query-параметрами
            const url = new URL('https://api.lookvogue.ru/v1/catalog/search');
            url.searchParams.append('offset', this.currentOffset);
            url.searchParams.append('limit', this.limit);


            const response = yield fetch(url.toString(), {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({query: this.currentSearchQuery})
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newCards = yield response.json();
            this.hasMore = newCards.length >= this.limit;
            this.currentOffset += newCards.length;

            const pendingCards = newCards.map(card => ({
                ...card,
                _pending: true,
                _key: this.getUniqueKey()
            }));

            this.cards = [...this.cards, ...pendingCards];

            setTimeout(() => {
                this.cards = this.cards.map(c => ({
                    ...c,
                    _pending: false,
                    style: {
                        transform: 'translate(0, 0) rotate(0deg)',
                        opacity: 1,
                        transition: `all 800ms ease-out`
                    }
                }));
            }, 50);

        } catch (err) {
            this.error = err.message;
            console.error("Card loading error:", err);
        } finally {
            this.isFetching = false;
            this.loading = false;
        }
    });

    checkPreload = () => {
        if (this.cards.length <= this.preloadThreshold &&
            this.hasMore &&
            !this.isFetching &&
            !this.preloadInProgress) {
            this.fetchCards();
        }
    };

    fetchCardsWithSearch = flow(function* (searchRequest) {
        this.currentSearchQuery = searchRequest.query?.trim() || null;
        this.hasMore = true;
        yield this.fetchCards(true); // initialLoad = true
    });

    // Метод для сброса поиска
    resetSearch = flow(function* () {
        this.currentSearchQuery = null;
        this.hasMore = true;
        yield this.fetchCards(true);
    });

    handleSwipe = (direction, card) => {
        if (direction === 'down') return;

        this.swipeHistory = [{ direction, card }, ...this.swipeHistory];
        this.cards = this.cards.filter(c => c.id !== card.id);

        if (direction === 'up') {
            this.basket = [...this.basket, card];
        }

        if (this.cards.length < 7 && this.hasMore && !this.isFetching) {
            this.fetchCards();
        }
    };

    undoSwipe = () => {
        if (this.swipeHistory.length === 0) return;

        const lastAction = this.swipeHistory[0];
        const { direction, card } = lastAction;

        const restoredCard = {
            ...card,
            _pending: true,
            _key: this.getUniqueKey()
        };

        this.cards = [ {
            ...restoredCard,
            style: {
                opacity: 0,
                zIndex: 1001
            }
        }, ...this.cards];

        setTimeout(() => {
            this.cards = this.cards.map(c =>
                c.id === restoredCard.id ? {
                    ...c,
                    _pending: false,
                    style: {
                        transform: 'translate(0, 0) rotate(0deg)',
                        opacity: 1,
                        transition: `all 800ms ease-out`
                    }
                } : c
            );
        }, 50);

        this.swipeHistory = this.swipeHistory.slice(1);
        if (direction === 'up') {
            this.basket = this.basket.filter(c => c.id !== card.id);
        }
    };
}

export default CatalogStore;