import { useState, useEffect } from 'react';

const Profile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            setUserData(user);
        }
    }, []);

    if (!userData) {
        return <div>Loading user data...</div>;
    }

    return (
        <div style={styles.profileContainer}>
            <div style={styles.avatarContainer}>
                {userData.photo_url ? (
                    <img
                        src={userData.photo_url}
                        alt="User Avatar"
                        style={styles.avatar}
                    />
                ) : (
                    <div style={styles.avatarPlaceholder}>
                        {(userData.first_name && userData.first_name[0]) || ''}
                        {(userData.last_name && userData.last_name[0]) || ''}
                    </div>
                )}
            </div>

            <div style={styles.username}>
                @{userData.username || 'undefined_username'}
            </div>
        </div>
    );
};

const styles = {
    profileContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    avatarContainer: {
        marginRight: '16px',
    },
    avatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarPlaceholder: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
    },
    username: {
        fontSize: '18px',
        fontWeight: 500,
        color: '#212121',
    },
};

export default Profile;