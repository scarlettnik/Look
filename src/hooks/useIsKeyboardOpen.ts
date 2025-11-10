import { useState, useEffect } from 'react';

const KEYBOARD_HEIGHT_THRESHOLD_PX = 120;

const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;

const useKeyboardVisibility = () => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        let baselineViewportHeight = getViewportHeight();

        const handleResize = () => {
            const currentViewportHeight = getViewportHeight();
            const keyboardHeight = baselineViewportHeight - currentViewportHeight;

            setIsKeyboardVisible(keyboardHeight > KEYBOARD_HEIGHT_THRESHOLD_PX);

            if (currentViewportHeight > baselineViewportHeight) {
                baselineViewportHeight = currentViewportHeight;
            }
        };

        window.visualViewport?.addEventListener('resize', handleResize);
        window.addEventListener('resize', handleResize);

        return () => {
            window.visualViewport?.removeEventListener('resize', handleResize);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return isKeyboardVisible;
};

export default useKeyboardVisibility;
