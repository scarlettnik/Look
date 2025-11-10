const normalizeSources = (sources: string[]) => Array.from(new Set(sources.filter(Boolean)));

export const preloadImage = (source: string) => {
    return new Promise<void>((resolve) => {
        const image = new Image();
        let settled = false;

        const resolveOnce = () => {
            if (settled) {
                return;
            }

            settled = true;
            resolve();
        };

        image.decoding = 'async';
        image.onload = resolveOnce;
        image.onerror = resolveOnce;
        image.src = source;

        if (image.complete) {
            resolveOnce();
        }
    });
};

export const preloadImages = async (sources: string[]) => {
    await Promise.all(normalizeSources(sources).map((source) => preloadImage(source)));
};

export const warmImageAssets = (sources: string[]) => {
    const uniqueSources = normalizeSources(sources);
    const warmup = () => {
        uniqueSources.forEach((source) => {
            void preloadImage(source);
        });
    };

    const windowWithIdleCallback = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };

    if (windowWithIdleCallback.requestIdleCallback) {
        windowWithIdleCallback.requestIdleCallback(warmup, { timeout: 1200 });
        return;
    }

    window.setTimeout(warmup, 150);
};
