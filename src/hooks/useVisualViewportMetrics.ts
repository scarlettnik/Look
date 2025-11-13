import { useEffect, useState } from 'react';

type ViewportMetrics = {
    height: number;
    width: number;
    offsetTop: number;
    keyboardOffset: number;
};

const getViewportMetrics = (): ViewportMetrics => {
    if (typeof window === 'undefined') {
        return {
            height: 0,
            width: 0,
            offsetTop: 0,
            keyboardOffset: 0,
        };
    }

    const viewport = window.visualViewport;
    const height = Math.round(viewport?.height ?? window.innerHeight);
    const width = Math.round(viewport?.width ?? window.innerWidth);
    const offsetTop = Math.max(0, Math.round(viewport?.offsetTop ?? 0));
    const keyboardOffset = Math.max(0, window.innerHeight - height - offsetTop);

    return {
        height,
        width,
        offsetTop,
        keyboardOffset,
    };
};

const isSameMetrics = (left: ViewportMetrics, right: ViewportMetrics) =>
    left.height === right.height
    && left.width === right.width
    && left.offsetTop === right.offsetTop
    && left.keyboardOffset === right.keyboardOffset;

const useVisualViewportMetrics = (enabled = true) => {
    const [metrics, setMetrics] = useState<ViewportMetrics>(() => getViewportMetrics());

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') {
            return undefined;
        }

        const syncMetrics = () => {
            const nextMetrics = getViewportMetrics();
            setMetrics((currentMetrics) =>
                isSameMetrics(currentMetrics, nextMetrics) ? currentMetrics : nextMetrics,
            );
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                syncMetrics();
            }
        };

        syncMetrics();

        window.visualViewport?.addEventListener('resize', syncMetrics);
        window.visualViewport?.addEventListener('scroll', syncMetrics);
        window.addEventListener('resize', syncMetrics);
        window.addEventListener('orientationchange', syncMetrics);
        window.addEventListener('pageshow', syncMetrics);
        window.addEventListener('focus', syncMetrics);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.visualViewport?.removeEventListener('resize', syncMetrics);
            window.visualViewport?.removeEventListener('scroll', syncMetrics);
            window.removeEventListener('resize', syncMetrics);
            window.removeEventListener('orientationchange', syncMetrics);
            window.removeEventListener('pageshow', syncMetrics);
            window.removeEventListener('focus', syncMetrics);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [enabled]);

    return metrics;
};

export default useVisualViewportMetrics;
