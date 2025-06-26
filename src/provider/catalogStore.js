import { makeAutoObservable, flow } from "mobx";

class CatalogStore {
    cards = [];
    basket = [];
    loading = true;
    error = null;
    swipeHistory = [];
    isFetching = false;
    hasMore = true;
    authToken = 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';

    constructor() {
        makeAutoObservable(this);
        this.fetchCards()
    }

    getAuthHeaders = () => ({
        "ngrok-skip-browser-warning": true,
        'Content-Type': 'application/json',
        'Authorization': `tma ${this.authToken}`
    });

    fetchCards = flow(function* (initialLoad = false) {
        if (!this.hasMore || this.isFetching) return;

        try {
            this.isFetching = true;
            if (initialLoad) this.loading = true;

            const response = yield fetch(`https://api.lookvogue.ru/v1/catalog/feed`, {
                method: 'GET',
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const newCards = yield response.json();
            const filtered = newCards.filter(card =>
                !this.cards.some(c => c.id === card.id)
            );

            if (filtered.length === 0) {
                this.hasMore = false;
                return;
            }

            const pendingCards = filtered.map(card => ({
                ...card,
                _pending: true,
                _key: Math.random().toString(36).substr(2, 9)
            }));

            this.cards = [...this.cards, ...pendingCards];

            setTimeout(() => {
                this.cards = this.cards.map(c =>
                    c._pending ? {...c, _pending: false} : c
                );
            }, 300);

        } catch (err) {
            this.error = err.message;
            console.error("Card loading error:", err);
        } finally {
            this.isFetching = false;
            this.loading = false;
        }
    });

    handleSwipe = (direction, card) => {
        if (direction === 'down') return;

        this.swipeHistory = [{ direction, card }, ...this.swipeHistory];
        this.cards = this.cards.filter(c => c.id !== card.id);

        if (direction === 'up') {
            this.basket = [...this.basket, card];
        }
    };

    undoSwipe = () => {
        if (this.swipeHistory.length === 0) return;

        const lastAction = this.swipeHistory[0];
        const { direction, card } = lastAction;

        const restoredCard = {
            ...card,
            _pending: true,
            _key: Math.random().toString(36).substr(2, 9)
        };

        this.cards = [{
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