import { useState, useEffect } from 'react';
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../provider/AuthProvider.jsx";


const Profile = () => {
    const { data, loading, error } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log(data)

    if (!data) {
        return (
            <>
                <div>Loading user data...</div>
                <Sidebar/>
            </>

        );
    }

    return (
        <>
            <div style={styles.profileContainer}>
                <div style={styles.avatarContainer}>
                    {data.photo_url ? (
                        <img
                            src={data.photo_url}
                            alt="User Avatar"
                            style={styles.avatar}
                        />
                    ) : (
                        <div style={styles.avatarPlaceholder}>
                            {(data.first_name && data.first_name[0]) || ''}
                            {(data.last_name && data.last_name[0]) || ''}
                        </div>
                    )}
                </div>

                <div style={styles.username}>

                    {data.first_name} {" "} {data.last_name || ''}
                </div>
            </div>
            <Sidebar/>
        </>

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