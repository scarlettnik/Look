import styles from '../ui/shared/fullScreenButton.module.css';

const FullScreenButton = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    disabled,
    type = 'button',
}: any) => {
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
