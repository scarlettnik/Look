// useKeyboardHeight.js
import { useState, useEffect } from 'react';

export const useKeyboardHeight = () => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (!isMobile) return;

            const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
            const currentViewportHeight = window.innerHeight;

            if (currentViewportHeight < initialViewportHeight * 0.7) {
                setKeyboardHeight(initialViewportHeight - currentViewportHeight);
            } else {
                setKeyboardHeight(0);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return keyboardHeight;
};