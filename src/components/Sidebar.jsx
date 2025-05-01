import { useState, useEffect, useRef } from "react";
import { Bookmark, GitBranch, House, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import './ui/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null);
    const [keyboardActive, setKeyboardActive] = useState(false);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    useEffect(() => {
        if (!isMobile) return;

        const handleFocus = () => setKeyboardActive(true);
        const handleBlur = () => setKeyboardActive(false);

        const inputs = document.querySelectorAll('input, textarea, [contenteditable]');
        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            });
        };
    }, [isMobile]);

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
            className={`sidebar ${keyboardActive ? 'keyboard-active' : ''}`}
            ref={sidebarRef}
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