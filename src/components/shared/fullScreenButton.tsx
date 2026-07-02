import type {
    ButtonHTMLAttributes,
    PropsWithChildren,
} from 'react';

import styles from '../ui/shared/fullScreenButton.module.css';

type FullScreenButtonVariant = 'primary' | 'light' | 'beige' | 'white';

type FullScreenButtonProps = PropsWithChildren<{
    variant?: FullScreenButtonVariant;
    className?: string;
} & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'className'
>>;

const FullScreenButton = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    disabled,
    type = 'button',
}: FullScreenButtonProps) => {
    const variantClassName = styles[variant] ?? styles.primary;

    return (
        <button
            type={type}
            className={`${styles.button} ${variantClassName} ${className}`.trim()}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default FullScreenButton;
