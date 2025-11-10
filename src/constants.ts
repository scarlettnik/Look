import {
    FacebookIcon,
    FacebookShareButton, LinkedinIcon, LinkedinShareButton, OKIcon, OKShareButton, RedditIcon, RedditShareButton,
    TelegramIcon,
    TelegramShareButton, TwitterIcon, TwitterShareButton, VKIcon, VKShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import { API_BASE_URL, SUPPORT_BOT_URL } from "./lib/apiClient";
import { BRAND_ASSETS, COLLECTION_ASSETS, ONBOARDING_ASSETS, UI_ICON_ASSETS } from "./lib/assets";

export const HOST_URL = API_BASE_URL;

export const SUPPORT_URL = SUPPORT_BOT_URL;

export const CLOTH_STYLES = [
    { id: 1, name: "y2k", url: ONBOARDING_ASSETS.stylePreview.y2k },
    { id: 3, name: "minimalist", url: ONBOARDING_ASSETS.stylePreview.minimalist },
    { id: 4, name: "romantic", url: ONBOARDING_ASSETS.stylePreview.romantic },
    { id: 5, name: "bohemian", url: ONBOARDING_ASSETS.stylePreview.bohemian },
    { id: 6, name: "preppy", url: ONBOARDING_ASSETS.stylePreview.preppy },
    { id: 7, name: "gothic", url: ONBOARDING_ASSETS.stylePreview.gothic },
    { id: 8, name: "athleisure", url: ONBOARDING_ASSETS.stylePreview.athleisure },
    { id: 9, name: "punk", url: ONBOARDING_ASSETS.stylePreview.punk },
    { id: 10, name: "vintage", url: ONBOARDING_ASSETS.stylePreview.vintage },
    { id: 2, name: "streetwear", url: ONBOARDING_ASSETS.stylePreview.streetwear },
    { id: 11, name: "office siren", url: ONBOARDING_ASSETS.stylePreview.officeSiren },
    { id: 12, name: "Eco-Friendly", url: ONBOARDING_ASSETS.stylePreview.ecoFriendly },
    { id: 13, name: "cyberpunk", url: ONBOARDING_ASSETS.stylePreview.cyberpunk },
    { id: 14, name: "chic", url: ONBOARDING_ASSETS.stylePreview.chic },
    { id: 15, name: "luxury", url: ONBOARDING_ASSETS.stylePreview.luxury },
    { id: 16, name: "skater", url: ONBOARDING_ASSETS.stylePreview.skater },
    { id: 17, name: "indie", url: ONBOARDING_ASSETS.stylePreview.indie },
    { id: 18, name: "high fashion", url: ONBOARDING_ASSETS.stylePreview.highFashion },
    { id: 19, name: "business casual", url: ONBOARDING_ASSETS.stylePreview.businessCasual },
    { id: 20, name: "normcore", url: ONBOARDING_ASSETS.stylePreview.normcore },
    { id: 21, name: "rockabilly", url: ONBOARDING_ASSETS.stylePreview.rockabilly },
    { id: 22, name: "futuristic", url: ONBOARDING_ASSETS.stylePreview.futuristic },
    { id: 23, name: "monochrome", url: ONBOARDING_ASSETS.stylePreview.monochrome },
    { id: 24, name: "art deco", url: ONBOARDING_ASSETS.stylePreview.artDeco },
    { id: 25, name: "hip hop", url: ONBOARDING_ASSETS.stylePreview.hipHop },
    { id: 26, name: "cozy", url: ONBOARDING_ASSETS.stylePreview.cozy },
    { id: 27, name: "casual", url: ONBOARDING_ASSETS.stylePreview.casual },
    { id: 28, name: "avant garde", url: ONBOARDING_ASSETS.stylePreview.avantGarde },
    { id: 29, name: "military", url: ONBOARDING_ASSETS.stylePreview.military }
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

export const BOTNAME = 'look_app_bot'

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
    { id: 1, image: ONBOARDING_ASSETS.starterCards[0], direction: 'right' },
    { id: 2, image: ONBOARDING_ASSETS.starterCards[1], direction: 'left' },
    { id: 3, image: ONBOARDING_ASSETS.starterCards[2], direction: 'resist' }
];

export const coverImages = COLLECTION_ASSETS.coverImages;

export const BRAND_LOGO = BRAND_ASSETS.logo;

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
            { src: ONBOARDING_ASSETS.arrows.left, alt: 'arrow', className: 'onboardingArrowLeft' },
            { src: UI_ICON_ASSETS.dislikeDark, alt: 'Дизайк', className: 'onboardingDislikeIcon' }
        ]
    },
    3: {
        text: 'При свайпе вправо карточка попадает в подборку и подобные стили показываются чаще.',
        page: '3/6',
        swipe: 'up',
        images: [
            { src: ONBOARDING_ASSETS.arrows.right, alt: 'arrow', className: 'onboardingArrowRight' },
            { src: UI_ICON_ASSETS.likeDark, alt: 'Лайк', className: 'onboardingLikeIcon' }
        ],
    },
    4: {
        swipe: 'down',
        text: 'При свайпе вверх появляется новая карточка. Предыдущую можно найти, кликнув на иконку «Назад».',
        page: '4/6',
        images: [
            { src: ONBOARDING_ASSETS.arrows.up, alt: 'arrow', className: 'onboardingArrowUp' },
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
