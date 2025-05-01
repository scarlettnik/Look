// hooks/useKeyboardStatus.js
import { useState, useEffect } from 'react';

export const useKeyboardStatus = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    useEffect(() => {
        const handleFocus = () => setIsKeyboardOpen(true);
        const handleBlur = () => setIsKeyboardOpen(false);

        const inputs = document.querySelectorAll('input, textarea, [contenteditable]');

        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            });
        };
    }, []);

    return isKeyboardOpen;
};