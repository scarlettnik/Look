import { makeAutoObservable } from "mobx";
import { toJS } from 'mobx';

class CollectionStore {
    saves = [
        {
            id: 1,
            name: "All Saved",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
            items: [
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 1,
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 2,
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 3,
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 4,
                },
            ],
        },
        {
            id: 2,
            name: "Travel Plans",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
            items: [
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 1,
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 2,
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                    id: 3,
                },
            ],
        },
        {
            id: 3,
            name: "Home Decor",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 4,
            name: "Recipes",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 5,
            name: "Books",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 6,
            name: "Movies",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 7,
            name: "All Saved",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 8,
            name: "Travel Plans",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
    ];

    constructor() {
        makeAutoObservable(this);
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('saves');
        if (saved) this.saves = JSON.parse(saved);
    }

    saveToLocalStorage() {
        localStorage.setItem('saves', JSON.stringify(toJS(this.saves)));
    }

    updateCollection = (id, updates) => {
        const index = this.saves.findIndex(save => save.id === id);
        if (index !== -1) {
            this.saves[index] = { ...this.saves[index], ...updates };
            this.saveToLocalStorage();
        }
    };

    createCollection = (name, coverUrl) => {
        if (!name.trim()) return;

        this.saves = [
            {
                id: Date.now(),
                name: name.trim(),
                url: coverUrl || "https://via.placeholder.com/150/cccccc",
                items: []
            },
            ...this.saves
        ];
        this.saveToLocalStorage();
    };

    deleteCollections = (ids) => {
        this.saves = this.saves.filter(save => !ids.includes(save.id));
        this.saveToLocalStorage();
    };
}

export default CollectionStore;