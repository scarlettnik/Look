import styles from "../ui/shared/skeleton.module.css";

type CustomSkeletonProps = {
    className?: string;
};

const CustomSkeleton = ({
    className = "",
}: CustomSkeletonProps) => {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
        />
    );
};

export default CustomSkeleton;
