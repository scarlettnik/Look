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

    getUniqueKey = () => {
        // Пытаемся использовать crypto.randomUUID() если доступно
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // Фолбэк для старых браузеров
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substr(2, 16);
        const performanceMark = typeof performance !== 'undefined'
            ? performance.now().toString(36).replace('.', '')
            : Math.random().toString(36).substr(2, 8);

        return `${timestamp}-${randomPart}-${performanceMark}`;
    };

    constructor() {
        makeAutoObservable(this);
        this.fetchCards();
    }

    getAuthHeaders = () => ({
        "ngrok-skip-browser-warning": true,
        'Content-Type': 'application/json',
        'Authorization': `tma ${this.authToken}`
    });

    // Основной метод загрузки карточек
    fetchCards = flow(function* (initialLoad = false) {
        if (!this.hasMore || this.isFetching) return;

        try {
            this.isFetching = true;
            if (initialLoad) {
                this.loading = true;
                this.cards = []; // Очищаем карточки при новой загрузке
            }

            // Всегда добавляем searchQuery если он есть
            const requestBody = this.currentSearchQuery
                ? { query: this.currentSearchQuery }
                : {};

            const response = yield fetch(`https://api.lookvogue.ru/v1/catalog/search`, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newCards = yield response.json();

            const pendingCards = newCards.map(card => ({
                ...card,
                _pending: true,
                _key: this.getUniqueKey()
            }));

            this.cards = [...this.cards, ...pendingCards];
            this.hasMore = newCards.length > 0;

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

    // Метод для поиска
    fetchCardsWithSearch = flow(function* (searchRequest) {
        this.currentSearchQuery = searchRequest.query?.trim() || null;
        this.hasMore = true; // Сбрасываем флаг при новом поиске
        yield this.fetchCards(true); // initialLoad = true
    });

    // Метод для сброса поиска
    resetSearch = () => {
        this.currentSearchQuery = null;
        this.hasMore = true;
        this.fetchCards(true);
    };

    handleSwipe = (direction, card) => {
        if (direction === 'down') return;

        this.swipeHistory = [{ direction, card }, ...this.swipeHistory];
        this.cards = this.cards.filter(c => c.id !== card.id);

        if (direction === 'up') {
            this.basket = [...this.basket, card];
        }

        // Автоподгрузка при малом количестве карточек
        if (this.cards.length < 3 && this.hasMore && !this.isFetching) {
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

        this.cards = [...this.cards, {
            ...restoredCard,
            style: {
                opacity: 0,
                zIndex: 1001
            }
        }];

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