import buttonWrapperStyles from '../ui/shared/buttonWrapper.module.css';

const ButtonWrapper = ({ children, className = '' }: any) => {
    return <div className={`${buttonWrapperStyles.wrapper} ${className}`.trim()}>{children}</div>;
};

export default ButtonWrapper;
