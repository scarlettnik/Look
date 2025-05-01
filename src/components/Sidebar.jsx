import { useState, useEffect } from "react";
import { Bookmark, GitBranch, House, ShoppingCart, User } from 'lucide-react';
import './ui/Sidebar.css';
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import {useKeyboardStatus} from "../hooks/isKeyboardStatus.js";


const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isKeyboardOpen = useKeyboardStatus();
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
        <>
            {!isKeyboardOpen && (
        <div
            className="sidebar"
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
            )}
        </>
    );
};

export default Sidebar;