import React from 'react'
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../provider/AuthProvider.jsx";

const ShoppingCard = () => {
    const { data, loading, error } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div>

            </div>
            <Sidebar/>
        </>

    )
}

export default ShoppingCard;
