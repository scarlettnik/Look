import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './bottomSheet.module.css';
import { UI_ICON_ASSETS } from '../../../lib/assets';

const SHEET_ANIMATION_DURATION_MS = 280;

type BottomSheetSize = 'default' | 'tall' | 'fullscreen';

type BottomSheetProps = PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    size?: BottomSheetSize;
    panelClassName?: string;
    backdropClassName?: string;
    closeOnBackdrop?: boolean;
    showCloseButton?: boolean;
    onAfterClose?: () => void;
}>;

let bodyScrollLockCount = 0;
let previousBodyOverflow = '';

const lockBodyScroll = () => {
    if (typeof document === 'undefined') {
        return;
    }

    if (bodyScrollLockCount === 0) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }

    bodyScrollLockCount += 1;
};

const unlockBodyScroll = () => {
    if (typeof document === 'undefined' || bodyScrollLockCount === 0) {
        return;
    }

    bodyScrollLockCount -= 1;

    if (bodyScrollLockCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
    }
};

const BottomSheet = ({
    isOpen,
    onClose,
    size = 'default',
    panelClassName = '',
    backdropClassName = '',
    closeOnBackdrop = true,
    showCloseButton = true,
    onAfterClose,
    children,
}: BottomSheetProps) => {
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);
    const isBodyScrollLockedRef = useRef(false);
    const backdropRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const sizeClassName = useMemo(() => {
        switch (size) {
            case 'tall':
                return styles.sheetPanelTall;
            case 'fullscreen':
                return styles.sheetPanelFullscreen;
            default:
                return styles.sheetPanelDefault;
        }
    }, [size]);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            return undefined;
        }

        if (!isMounted) {
            return undefined;
        }

        setIsVisible(false);

        const closeTimer = window.setTimeout(() => {
            setIsMounted(false);
            onAfterClose?.();
        }, SHEET_ANIMATION_DURATION_MS);

        return () => window.clearTimeout(closeTimer);
    }, [isMounted, isOpen, onAfterClose]);

    useEffect(() => {
        if (!isMounted || !isOpen) {
            return undefined;
        }

        let repaintTimer = 0;
        let animationFrameId = 0;

        const forcePaint = () => {
            const backdropElement = backdropRef.current;
            const panelElement = panelRef.current;

            if (!backdropElement || !panelElement) {
                return;
            }

            void backdropElement.getBoundingClientRect();
            void panelElement.getBoundingClientRect();
            void panelElement.offsetHeight;
        };

        animationFrameId = window.requestAnimationFrame(() => {
            setIsVisible(true);
            forcePaint();

            repaintTimer = window.setTimeout(forcePaint, 80);
        });

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.clearTimeout(repaintTimer);
        };
    }, [isMounted, isOpen]);

    useEffect(() => {
        if (isOpen && !isBodyScrollLockedRef.current) {
            lockBodyScroll();
            isBodyScrollLockedRef.current = true;
        } else if (!isOpen && isBodyScrollLockedRef.current) {
            unlockBodyScroll();
            isBodyScrollLockedRef.current = false;
        }
    }, [isOpen]);

    useEffect(() => {
        return () => {
            if (isBodyScrollLockedRef.current) {
                unlockBodyScroll();
                isBodyScrollLockedRef.current = false;
            }
        };
    }, []);

    if (!isMounted) {
        return null;
    }

    const sheetMarkup = (
        <div
            ref={backdropRef}
            className={[
                styles.sheetBackdrop,
                isVisible ? styles.sheetBackdropVisible : '',
                backdropClassName,
            ].filter(Boolean).join(' ')}
            onClick={closeOnBackdrop ? onClose : undefined}
        >
            <div
                ref={panelRef}
                className={[
                    styles.sheetPanel,
                    sizeClassName,
                    isVisible ? styles.sheetPanelVisible : '',
                    panelClassName,
                ].filter(Boolean).join(' ')}
                onClick={(event) => event.stopPropagation()}
            >
                {showCloseButton && (
                    <button type="button" className={styles.sheetCloseButton} onClick={onClose} aria-label="Закрыть">
                        <img src={UI_ICON_ASSETS.close} alt="Закрыть" />
                    </button>
                )}
                {children}
            </div>
        </div>
    );

    if (typeof document === 'undefined') {
        return sheetMarkup;
    }

    return createPortal(sheetMarkup, document.body);
};

export default BottomSheet;
