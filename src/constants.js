// export const getAuthToken = () => {
//     if (!window.Telegram?.WebApp?.initData) {
//         return 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';
//     }
//     return window.Telegram.WebApp.initData;
// };
import {
    FacebookIcon,
    FacebookShareButton, LinkedinIcon, LinkedinShareButton, OKIcon, OKShareButton, RedditIcon, RedditShareButton,
    TelegramIcon,
    TelegramShareButton, TwitterIcon, TwitterShareButton, VKIcon, VKShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";

export const AUTH_TOKEN = 'user=%7B%22id%22%3A1671274831%2C%22first_name%22%3A%22%D0%A1%D0%BE%D1%84%D1%8C%D1%8F%22%2C%22last_name%22%3A%22%D0%9C%D0%B0%D1%80%D1%87%D1%83%D0%BA%22%2C%22username%22%3A%22scarlettnik%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F9zQoUimkDP8GJlxHvaSdoTyyBjp-d_3fHGjyYeoPoTI.svg%22%7D&chat_instance=-6489690302062850781&chat_type=sender&auth_date=1742513384&signature=tr7IXxOkPsCygck72EqkJ1MtXDf2zvLF74pCKeyXNp8iNjJ9n3GBE7tQHQMuqAVCp3WyYdx5rQ2WO1fBtCaSBg&hash=c0a2ab6465de8874bbc9428faab5e30a58927f259b6d824e5f017605f7a4bfcd';


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

export const sizeRanges = {
    "XXS": "38-40",
    "XS": "40-42",
    "S": "42-44",
    "M": "44-46",
    "L": "46-48",
    "XL": "48-50",
    "XXL": "50-52",
    "3XL": "52-54",
    "4XL": "54-56"
};

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
        speedMultiplier: 1.2,
        animationDuration: 1500
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

export const shareButtons = [
    { Button: TelegramShareButton, Icon: TelegramIcon, name: 'Telegram' },
    { Button: WhatsappShareButton, Icon: WhatsappIcon, name: 'WhatsApp' },
    { Button: FacebookShareButton, Icon: FacebookIcon, name: 'Facebook' },
    { Button: TwitterShareButton, Icon: TwitterIcon, name: 'Twitter' },
    { Button: VKShareButton, Icon: VKIcon, name: 'VK' },
    { Button: OKShareButton, Icon: OKIcon, name: 'OK' },
    { Button: RedditShareButton, Icon: RedditIcon, name: 'Reddit' },
    { Button: LinkedinShareButton, Icon: LinkedinIcon, name: 'LinkedIn' },
];

export const ANIMATION_PARAMS = {
    resist: {
        maxTranslate: 150,
        maxRotate: 15,
        swipeDuration: 2000,
        holdDuration: 400,
        returnDuration: 1200,
        restDuration: 1000,
        get totalDuration() {
            return this.swipeDuration + this.holdDuration + this.returnDuration + this.restDuration;
        }
    },
    regular: {
        swipeDistance: 500,
        duration: 2000,
        maxRotate: 30
    }
};

export const START_CARDS = [
    { id: 1, image: '/starterscroller.png', direction: 'right' },
    { id: 2, image: '/starterscroller2.png', direction: 'left' },
    { id: 3, image: '/starterscroller3.png', direction: 'resist' }
];

export const coverImages = [
    { url: 'https://avatars.mds.yandex.net/i?id=022c655b21f79d8837185f96c6e208dd_l-10767434-images-thumbs&n=13' },
    { url: 'https://avatars.mds.yandex.net/i?id=b72991f884a5e936aa5286616fd944ef5c77f65d-5103756-images-thumbs&n=13' },
    { url: 'https://avatars.mds.yandex.net/i?id=b4170aae9d2bf4bda8d5e9a133596db6d28b0b00-4964301-images-thumbs&n=13' },
    { url: 'https://avatars.mds.yandex.net/i?id=b30a65786fa5f71b7ba6efed2203bda0860ad43c-5086925-images-thumbs&n=13' },
    { url: 'https://avatars.mds.yandex.net/i?id=705d9c73d39904eb00e8f3db6635a4f55c3907ca-4594854-images-thumbs&n=13'},
    { url: 'https://avatars.mds.yandex.net/i?id=6c27e518e46665088413237506280fd3721711b6-10636720-images-thumbs&n=13' }
]

export const ONBOARDING_STEPS = {
    1: {
        text: 'Привет! За пару кликов расскажем, как тут всё устроено. Открыть карточку с деталями можно кликнув на неё.',
        page: '1/6',
        swipe: 'left',
    },
    2: {
        text: 'При свайпе влево карточка пропадает из ленты и подобные стили показываются реже.',
        page: '2/6',
        swipe: 'right',
        images: [
            { src: '/arrowleft.svg', alt: 'arrow', style: { position: 'fixed', right: '2vw', bottom: '220px', width: '30%', rotate: '8deg' } },
            { src: '/subicons/darkdislike.svg', alt: 'Дизайк', style: { position: 'fixed', left: '2vw', top: '50%', transform: 'translateY(-50%)', width: '80px', height: '80px', zIndex: 1000001 } }
        ]
    },
    3: {
        text: 'При свайпе вправо карточка попадает в подборку и подобные стили показываются чаще.',
        page: '3/6',
        swipe: 'up',
        images: [
            { src: '/arrow.svg', alt: 'arrow', style: { position: 'fixed', left: '2vw', bottom: '220px', width: '30%', rotate: '-8deg' } },
            { src: '/subicons/darklike.svg', alt: 'Лайк', style: { position: 'fixed', right: '2vw', top: '50%', transform: 'translateY(-50%)', width: '80px', height: '80px', zIndex: 1000001 } }
        ],
    },
    4: {
        swipe: 'down',
        text: 'При свайпе вверх появляется новая карточка. Предыдущую можно найти, кликнув на иконку «Назад».',
        page: '4/6',
        images: [
            { src: '/arrowup.svg', alt: 'arrow', style: { position: 'fixed', left: '2vw', bottom: '220px', width: '20%', rotate: '-8deg' } },
        ]
    },
    5: {
        text: 'Здесь можно найти все сохранённые карточки и создать свои подборки.',
        page: '5/6',
    },
    6: {
        text: 'А тут — подборки по стилям и направлениям. При нажатии на фото из подборки откроется карточка товара.',
        page: '6/6',
    },
};
