const onboardingAssetsBasePath = '/assets/onboarding';
const collectionAssetsBasePath = '/assets/collections';
const navigationIconsBasePath = '/assets/icons/navigation';
const uiIconsBasePath = '/assets/icons/ui';

export const BRAND_ASSETS = {
    logo: '/assets/branding/logo.svg',
};

export const NAVIGATION_ICON_ASSETS = {
    active: {
        home: `${navigationIconsBasePath}/active/home.svg`,
        profile: `${navigationIconsBasePath}/active/profile.svg`,
        save: `${navigationIconsBasePath}/active/save.svg`,
        shop: `${navigationIconsBasePath}/active/shop.svg`,
        trends: `${navigationIconsBasePath}/active/trends.svg`,
    },
    inactive: {
        home: `${navigationIconsBasePath}/inactive/home.svg`,
        profile: `${navigationIconsBasePath}/inactive/profile.svg`,
        save: `${navigationIconsBasePath}/inactive/save.svg`,
        shop: `${navigationIconsBasePath}/inactive/shop.svg`,
        trends: `${navigationIconsBasePath}/inactive/trends.svg`,
    },
    highlight: {
        save: `${navigationIconsBasePath}/highlight/save.svg`,
        trends: `${navigationIconsBasePath}/highlight/trends.svg`,
    },
};

type NavigationIconName = keyof typeof NAVIGATION_ICON_ASSETS.active;

export const getNavigationIconPath = (iconName: NavigationIconName, isActive: boolean) => {
    return isActive
        ? NAVIGATION_ICON_ASSETS.active[iconName]
        : NAVIGATION_ICON_ASSETS.inactive[iconName];
};

export const UI_ICON_ASSETS = {
    activeFilter: `${uiIconsBasePath}/active-filter.svg`,
    arrowLeft: `${uiIconsBasePath}/arrow-left.svg`,
    arrowLeftLight: `${uiIconsBasePath}/arrow-left-light.svg`,
    arrowLeftWhite: `${uiIconsBasePath}/arrow-left-white.svg`,
    blackAdd: `${uiIconsBasePath}/black-add.svg`,
    bookmarkWhite: `${uiIconsBasePath}/bookmark-white.svg`,
    bookmarkWhiteFilled: `${uiIconsBasePath}/bookmark-white-filled.svg`,
    checkmark: `${uiIconsBasePath}/checkmark.svg`,
    close: `${uiIconsBasePath}/close.svg`,
    dislikeDark: `${uiIconsBasePath}/dislike-dark.svg`,
    edit: `${uiIconsBasePath}/edit.svg`,
    filter: `${uiIconsBasePath}/filter.svg`,
    likeDark: `${uiIconsBasePath}/like-dark.svg`,
    minus: `${uiIconsBasePath}/minus.svg`,
    plus: `${uiIconsBasePath}/plus.svg`,
    search: `${uiIconsBasePath}/search.svg`,
    share: `${uiIconsBasePath}/share.svg`,
    shoppingBag: `${uiIconsBasePath}/shopping-bag.svg`,
};

export const PLACEHOLDER_ASSETS = {
    collectionBanner: '/assets/placeholders/collection-banner.jpg',
    stylePreview: '/assets/placeholders/style-preview.png',
};

export const ONBOARDING_ASSETS = {
    backgroundImage: `${onboardingAssetsBasePath}/backgrounds/start-image.png`,
    continueArrow: `${onboardingAssetsBasePath}/arrows/continue-arrow.svg`,
    arrows: {
        left: `${onboardingAssetsBasePath}/arrows/arrow-left.svg`,
        right: `${onboardingAssetsBasePath}/arrows/arrow-right.svg`,
        up: `${onboardingAssetsBasePath}/arrows/arrow-up.svg`,
    },
    starterCards: [
        `${onboardingAssetsBasePath}/cards/starter-scroller-1.png`,
        `${onboardingAssetsBasePath}/cards/starter-scroller-2.png`,
        `${onboardingAssetsBasePath}/cards/starter-scroller-3.png`,
    ],
    stylePreview: {
        y2k: `${onboardingAssetsBasePath}/styles/y2k.png`,
        minimalist: `${onboardingAssetsBasePath}/styles/minimalist.png`,
        romantic: `${onboardingAssetsBasePath}/styles/romantic.png`,
        bohemian: `${onboardingAssetsBasePath}/styles/bohemian.png`,
        preppy: `${onboardingAssetsBasePath}/styles/preppy.png`,
        gothic: `${onboardingAssetsBasePath}/styles/gothic.png`,
        athleisure: `${onboardingAssetsBasePath}/styles/athleisure.png`,
        punk: `${onboardingAssetsBasePath}/styles/punk.png`,
        vintage: `${onboardingAssetsBasePath}/styles/vintage.png`,
        streetwear: `${onboardingAssetsBasePath}/styles/streetwear.png`,
        officeSiren: `${onboardingAssetsBasePath}/styles/office-siren.png`,
        ecoFriendly: `${onboardingAssetsBasePath}/styles/eco-friendly.png`,
        cyberpunk: `${onboardingAssetsBasePath}/styles/cyberpunk.png`,
        chic: `${onboardingAssetsBasePath}/styles/chic.png`,
        luxury: `${onboardingAssetsBasePath}/styles/luxury.png`,
        skater: `${onboardingAssetsBasePath}/styles/skater.png`,
        indie: `${onboardingAssetsBasePath}/styles/indie.png`,
        highFashion: `${onboardingAssetsBasePath}/styles/high-fashion.png`,
        businessCasual: `${onboardingAssetsBasePath}/styles/business-casual.png`,
        normcore: `${onboardingAssetsBasePath}/styles/normcore.png`,
        rockabilly: `${onboardingAssetsBasePath}/styles/rockabilly.png`,
        futuristic: `${onboardingAssetsBasePath}/styles/futuristic.png`,
        monochrome: `${onboardingAssetsBasePath}/styles/monochrome.png`,
        artDeco: `${onboardingAssetsBasePath}/styles/art-deco.png`,
        hipHop: `${onboardingAssetsBasePath}/styles/hip-hop.png`,
        cozy: `${onboardingAssetsBasePath}/styles/cozy.png`,
        casual: `${onboardingAssetsBasePath}/styles/casual.png`,
        avantGarde: `${onboardingAssetsBasePath}/styles/avant-garde.png`,
        military: `${onboardingAssetsBasePath}/styles/military.png`,
    },
};

export const STARTUP_IMAGE_ASSETS = [
    BRAND_ASSETS.logo,
    ONBOARDING_ASSETS.backgroundImage,
    ONBOARDING_ASSETS.continueArrow,
    ...ONBOARDING_ASSETS.starterCards,
];

export const DEFERRED_IMAGE_ASSETS = Array.from(new Set([
    ...Object.values(NAVIGATION_ICON_ASSETS.active),
    ...Object.values(NAVIGATION_ICON_ASSETS.inactive),
    ...Object.values(NAVIGATION_ICON_ASSETS.highlight),
    ...Object.values(ONBOARDING_ASSETS.arrows),
    UI_ICON_ASSETS.activeFilter,
    UI_ICON_ASSETS.arrowLeft,
    UI_ICON_ASSETS.arrowLeftLight,
    UI_ICON_ASSETS.arrowLeftWhite,
    UI_ICON_ASSETS.blackAdd,
    UI_ICON_ASSETS.bookmarkWhite,
    UI_ICON_ASSETS.bookmarkWhiteFilled,
    UI_ICON_ASSETS.checkmark,
    UI_ICON_ASSETS.close,
    UI_ICON_ASSETS.dislikeDark,
    UI_ICON_ASSETS.edit,
    UI_ICON_ASSETS.filter,
    UI_ICON_ASSETS.likeDark,
    UI_ICON_ASSETS.minus,
    UI_ICON_ASSETS.plus,
    UI_ICON_ASSETS.search,
    UI_ICON_ASSETS.share,
    UI_ICON_ASSETS.shoppingBag,
]));

export const COLLECTION_ASSETS = {
    coverImages: Array.from({ length: 6 }, (_, index) => ({
        url: `${collectionAssetsBasePath}/covers/${index + 1}.jpg`,
    })),
};
