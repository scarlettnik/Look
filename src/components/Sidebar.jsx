import React from "react";
import {Bookmark, GitBranch, House, ShoppingCart, User} from 'lucide-react'
import './ui/Sidebar.css'
import {useNavigate, useLocation} from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Функция для проверки активного пути
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            <button
                onClick={() => navigate('/')}
                className={`sidebarbutton ${isActive('/') ? 'active' : ''}`}
            >
                <House/>
            </button>
            <button
                onClick={() => navigate('/save')}
                className={`sidebarbutton ${isActive('/save') ? 'active' : ''}`}
            >
                <Bookmark/>
            </button>
            <button
                onClick={() => navigate('/compare')}
                className={`sidebarbutton ${isActive('/comoare') ? 'active' : ''}`}
            >
                <GitBranch/>
            </button>
            <button
                onClick={() => navigate('/shoppingcard')}
                className={`sidebarbutton ${isActive('/shoppingcard') ? 'active' : ''}`}
            >
                <ShoppingCart/>
            </button>
            <button
                onClick={() => navigate('/profile')}
                className={`sidebarbutton ${isActive('/profile') ? 'active' : ''}`}
            >
                <User/>
            </button>
        </div>
    );
};

export default Sidebar;