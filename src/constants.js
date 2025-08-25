export const getAuthToken = () => {
    if (!window.Telegram?.WebApp?.initData) {
        return 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';
    }
    return window.Telegram.WebApp.initData;
};
export const AUTH_TOKEN = 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';

export const CLOTH_STYLES = [
    { id: 1, name: "y2k", url: 'https://i.postimg.cc/q6wXCq8Z/image.png' },
    { id: 2, name: "streetwear", url: 'https://i.postimg.cc/B68fGHZ1/image.png' },
    { id: 3, name: "minimalist", url: 'https://i.postimg.cc/ZY3XFTWZ/image.png' },
    { id: 4, name: "romantic", url: 'https://i.postimg.cc/PrQc92bR/image.png' },
    { id: 5, name: "bohemian (boho)", url: 'https://i.postimg.cc/7LdQ0cDf/image.png' },
    { id: 6, name: "preppy", url: 'https://i.postimg.cc/j5Y4srtQ/image.png' },
    { id: 7, name: "gothic", url: 'https://i.postimg.cc/7hm3MG7m/image.png' },
    { id: 8, name: "athleisure", url: 'https://i.postimg.cc/nVkGt55B/image.png' },
    { id: 9, name: "punk", url: 'https://i.postimg.cc/sXJ7sQns/image.png' },
    { id: 10, name: "vintage", url: 'https://i.postimg.cc/NFJXrhqn/image.png' },
    { id: 11, name: "office siren", url: 'https://i.postimg.cc/02jD1N71/image.png' },
    { id: 12, name: "Eco-Friendly (Sustainable Fashion)", url: 'https://i.postimg.cc/Sxz9jtZZ/image.png' },
    { id: 13, name: "cyberpunk", url: 'https://i.postimg.cc/Y09G7XGz/image.png' },
    { id: 14, name: "chic", url: 'https://i.postimg.cc/wMGtjhD8/image.png' },
    { id: 15, name: "luxury", url: 'https://i.postimg.cc/nVR92tgR/image.png' },
    { id: 16, name: "skater", url: 'https://i.postimg.cc/52wthcKM/image.png' },
    { id: 17, name: "indie", url: 'https://i.postimg.cc/ZRDY8Jn6/image.png' },
    { id: 18, name: "high fashion", url: 'https://i.postimg.cc/nhYHd4MF/image.png' },
    { id: 19, name: "business casual", url: 'https://i.postimg.cc/QCTDc5Rr/image.png' },
    { id: 20, name: "normcore", url: 'https://i.postimg.cc/N0j5mJbq/image.png' },
    { id: 21, name: "rockabilly", url: 'https://i.postimg.cc/gJwjBxfg/image.png' },
    { id: 22, name: "futuristic", url: 'https://i.postimg.cc/nrJxYMZj/image.png' },
    { id: 23, name: "monochrome", url: 'https://i.postimg.cc/7P3wP1Mg/image.png' },
    { id: 24, name: "art deco", url: 'https://i.postimg.cc/wjGd4wgd/image.png' },
    { id: 25, name: "hip hop", url: 'https://i.postimg.cc/28Hp30qB/image.png' },
    { id: 26, name: "cozy", url: 'https://i.postimg.cc/vBwkCjKC/image.png' },
    { id: 27, name: "casual", url: 'https://i.postimg.cc/ZRL72qpy/image.png' },
    { id: 28, name: "avant garde", url: 'https://i.postimg.cc/Yq0nDM9h/image.png' },
    { id: 29, name: "military", url: 'https://i.postimg.cc/gjQvT9SZ/image.png' }
];

export const SIZES = [
    'XS / 40 - 42', 'S / 42 - 44', 'M / 44 - 46', 'L / 46 - 48', 'XL / 50 - 52', 'XXL / 52 - 54', 'XXXL / 54 - 56', 'NO SIZE'
];

export const BRANDS = [
    'Bershka', 'Zara', 'H&M', 'Zarina',
    'Gloria Jeans', 'Gucci', 'Nike', 'Puma', 'Love Republic'
];

export const COLORS = [
    'Черный', 'белый', 'Красный', 'Синий', 'Зеленый',
    'Желтый', 'Розовый', 'Серый', 'Коричневый', 'Бежевый'
];
export const PRICE_RANGES = [
    { label: 'до 3 000 ₽', value: 3000 },
    { label: 'до 5 000 ₽', value: 5000 },
    { label: 'до 10 000 ₽', value: 10000 }
];

export const BOTNAME = 'look_app_dev_bot'

export const VERTICAL_SWIPE_THRESHOLD_RATIO = 0.2;
export const HORIZONTAL_SWIPE_THRESHOLD_RATIO = 0.2;
export const INITIAL_CARDS_COUNT = 3;
export const SKELETON_COUNT = 3;

export const SWIPE_CONFIG = {
    horizontal: {
        threshold: 0.15,
        speedMultiplier: 0.8,
        rotationAngle: 25,
        animationDuration: 800
    },
    verticalUp: {
        threshold: 0.1,
        speedMultiplier: 0.8,
        animationDuration: 1000
    },
    verticalDown: {
        threshold: 1000000000000000000,
        speedMultiplier: 0.2,
        animationDuration: 5000
    },
    physics: {
        velocityThreshold: 0.9,
        power: 0.2,
        deceleration: 0.95
    }
};