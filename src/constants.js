// export const getAuthToken = () => {
//     if (!window.Telegram?.WebApp?.initData) {
//         return 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';
//     }
//     return window.Telegram.WebApp.initData;
// };
export const AUTH_TOKEN = window.Telegram.WebApp.initData;

export const CLOTH_STYLES = [
    { id: 1, name: "y2k", url: '/styles/y2k.png' },
    { id: 3, name: "minimalist", url: "/styles/minimalist.png" },
    { id: 4, name: "romantic", url: '/styles/romantic.png' },
    { id: 5, name: "bohemian", url: '/styles/bohemian.png' },
    { id: 6, name: "preppy", url: '/styles/preppy.png' },
    { id: 7, name: "gothic", url: '/styles/gothic.png' },
    { id: 8, name: "athleisure", url: '/styles/athleisure.png' },
    { id: 9, name: "punk", url: '/styles/punk.png' },
    { id: 10, name: "vintage", url: '/styles/vintage.png' },
    { id: 2, name: "streetwear", url: '/styles/streetwear.png' },
    { id: 11, name: "office siren", url: '/styles/officesiren.png' },
    { id: 12, name: "Eco-Friendly", url: '/styles/ecofriendly.png' },
    { id: 13, name: "cyberpunk", url: '/styles/cyberpunk.png' },
    { id: 14, name: "chic", url: '/styles/chic.png' },
    { id: 15, name: "luxury", url: '/styles/luxury.png' },
    { id: 16, name: "skater", url: '/styles/skater.png' },
    { id: 17, name: "indie", url: '/styles/indie.png' },
    { id: 18, name: "high fashion", url: '/styles/highfashion.png' },
    { id: 19, name: "business casual", url: '/styles/businesscasual.png' },
    { id: 20, name: "normcore", url: '/styles/normcore.png' },
    { id: 21, name: "rockabilly", url: '/styles/rockabilly.png' },
    { id: 22, name: "futuristic", url: '/styles/futuristic.png' },
    { id: 23, name: "monochrome", url: '/styles/monochrome.png' },
    { id: 24, name: "art deco", url: '/styles/artdeco.png' },
    { id: 25, name: "hip hop", url: '/styles/hiphop.png' },
    { id: 26, name: "cozy", url: '/styles/cozy.png' },
    { id: 27, name: "casual", url: '/styles/casual.png' },
    { id: 28, name: "avant garde", url: '/styles/avantgarde.png' },
    { id: 29, name: "military", url: '/styles/military.png' }
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
        rotationAngle: 15,
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