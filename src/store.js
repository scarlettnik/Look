// store.js
import { makeAutoObservable } from "mobx";
import { toJS } from 'mobx';

class AppStore {
    appData = null;

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
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
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
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
                },
                {
                    url: "https://ir.ozone.ru/s3/multimedia-1-e/wc1000/7159910162.jpg",
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
        {
            id: 9,
            name: "Home Decor",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 10,
            name: "Recipes",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 11,
            name: "Books",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
        {
            id: 12,
            name: "Movies",
            url: "https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13",
        },
    ];

    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.loadInitialData();
    }

    async loadInitialData() {
        this.isLoading = true;
        try {
            // В реальном приложении здесь будет запрос к API
            // Для демонстрации создадим искусственную задержку
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Симулируем получение данных
            this.appData = {
                message: "Данные успешно загружены!",
                timestamp: new Date().toISOString()
            };

            // Загружаем дополнительные элементы
            this.items = [
                { id: 401, title: "Дикая природа", description: "Животные в естественной среде", imageUrl: "https://via.placeholder.com/150/d32776" },
                { id: 402, title: "Космические пейзажи", description: "Туманности и галактики", imageUrl: "https://via.placeholder.com/150/f66b97" },
                { id: 403, title: "Подводный мир", description: "Коралловые рифы", imageUrl: "https://via.placeholder.com/150/56acb2" }
            ];
        } catch (err) {
            this.error = err.message;
        } finally {
            this.isLoading = false;
        }
    }
    updateCollection = (id, updates) => {
        const index = this.saves.findIndex(save => save.id === id);
        if (index !== -1) {
            this.saves[index] = { ...this.saves[index], ...updates };
            this.saveToLocalStorage(); // Если используете localStorage
        }
    };
    getCollectionById = (id) => {
        return this.saves.find(save => save.id === id);
    };


    createCollection = (name, coverUrl) => {
        if (!name.trim()) return;

        const newCollection = {
            id: Date.now(),
            name: name.trim(),
            url: coverUrl || "https://via.placeholder.com/150/cccccc"
        };

        this.saves = [newCollection, ...this.saves];
        this.saveToLocalStorage();
    };

    deleteCollections = (ids) => {
        this.saves = this.saves.filter(save => !ids.includes(save.id));
        this.saveToLocalStorage();
    };
    saveToLocalStorage() {
        localStorage.setItem('saves', JSON.stringify(toJS(this.saves)));
    }
}

const appStore = new AppStore();
export default appStore;