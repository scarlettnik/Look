import {useEffect, useState} from "react";
import styles from "../ui/profile/profile.module.css";

const UserInfo = ({ photoUrl, firstName, lastName }: any) => {
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        setShowSkeleton(true);

        const img = new Image();
        img.src = photoUrl;
        img.onload = () => {
            setShowSkeleton(false);
        };
        img.onerror = () => {
            setShowSkeleton(false);
        };
    }, [photoUrl]);

    return (
        <div className={styles.userInfo}>
            <div className={styles.avatar}>
                {showSkeleton && (
                    <div className={styles.skeleton} />
                )}

                <img
                    src={photoUrl}
                    className={`${styles.avatarImage} ${showSkeleton ? styles.hidden : ''}`}
                    alt="User avatar"
                />
            </div>
            <div className={styles.userName}>
                {firstName || lastName ? (
                    <div>
                        {firstName} {lastName}
                    </div>
                ) : (
                    <p>User</p>
                )}
            </div>
        </div>
    );
};
export default UserInfo
