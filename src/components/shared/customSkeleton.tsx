import styles from "../ui/shared/skeleton.module.css";

const CustomSkeleton = ({
                            className = ""
                        }: any) => {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
        />
    );
};

export default CustomSkeleton;
