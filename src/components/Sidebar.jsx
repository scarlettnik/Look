import React, { useState, useEffect } from "react";
import { Bookmark, GitBranch, House, ShoppingCart, User } from 'lucide-react';
import './ui/Sidebar.css';
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import {useKeyboardHeight} from "../hooks/useKyeboardHeight.js";


const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const keyboardHeight = useKeyboardHeight();

    const sidebarConfig = [
        { path: '/', exact: true },
        { path: '/save', matchPattern: '/save/*' },
        { path: '/compare', exact: true },
        { path: '/shoppingcard', exact: true },
        { path: '/profile', exact: true }
    ];

    const [activePath, setActivePath] = useState('/');

    useEffect(() => {
        const currentPath = sidebarConfig.find(({ path, matchPattern, exact }) => {
            return matchPattern
                ? matchPath(matchPattern, location.pathname)
                : exact
                    ? location.pathname === path
                    : location.pathname.startsWith(path);
        })?.path;

        if(currentPath) setActivePath(currentPath);
    }, [location.pathname]);

    return (
        <div
            className="sidebar"
            style={{
                bottom: keyboardHeight > 0 ? keyboardHeight + 'px' : '0',
                zIndex: 1 // Чтобы клавиатура перекрывала sidebar
            }}
        >
            <button
                className={`sidebarbutton ${activePath === '/' ? 'active' : ''}`}
                onClick={() => navigate('/')}>
                <House/>
            </button>

            <button
                className={`sidebarbutton ${activePath === '/save' ? 'active' : ''}`}
                onClick={() => navigate('/save')}>
                <Bookmark/>
            </button>

            <button
                className={`sidebarbutton ${activePath === '/compare' ? 'active' : ''}`}
                onClick={() => navigate('/compare')}>
                <GitBranch/>
            </button>

            <button
                className={`sidebarbutton ${activePath === '/shoppingcard' ? 'active' : ''}`}
                onClick={() => navigate('/shoppingcard')}>
                <ShoppingCart/>
            </button>

            <button
                className={`sidebarbutton ${activePath === '/profile' ? 'active' : ''}`}
                onClick={() => navigate('/profile')}>
                <User/>
            </button>
        </div>
    );
};

export default Sidebar;