import { useState, useEffect } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import './ui/Sidebar.css';
import useIsKeyboardOpen from "../hooks/useIsKeyboardOpen.js";

const Sidebar = () => {
    const isKeyboardOpen = useIsKeyboardOpen();
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarConfig = [
        { path: '/', exact: true },
        { path: '/save', matchPattern: '/save/*' },
        { path: '/trends', matchPattern: '/trends/*' },
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

        if (currentPath) setActivePath(currentPath);
    }, [location.pathname]);

    const getIconPath = (iconName, isActive) => {
        return `/menuIcons/${isActive ? 'active' : 'unactive'}/${iconName}.svg`;
    };

    return isKeyboardOpen ? null : (
        <div className='sidebar'>
            <button
                className= "sidebarbutton"
                onClick={() => navigate('/')}>
                <img
                    src={getIconPath('home', activePath === '/')}
                    alt="Home"
                    className="icon"
                />
            </button>

            <button
                className={`sidebarbutton ${activePath === '/save' ? 'active' : ''}`}
                onClick={() => navigate('/save')}>
                <img
                    src={getIconPath('save', activePath === '/save')}
                    alt="save"
                    className="icon"
                />
            </button>

            <button
                className={`sidebarbutton ${activePath === '/compare' ? 'active' : ''}`}
                onClick={() => navigate('/trends')}>
                <img
                    src={getIconPath('trends', activePath === '/trends')}
                    alt="trends"
                    className="icon"
                />
            </button>

            <button
                className={`sidebarbutton ${activePath === '/shoppingcard' ? 'active' : ''}`}
                onClick={() => navigate('/shoppingcard')}>
                <img
                    src={getIconPath('shop', activePath === '/shoppingcard')}
                    alt="Cart"
                    className="icon"
                />
            </button>

            <button
                className={`sidebarbutton ${activePath === '/profile' ? 'active' : ''}`}
                onClick={() => navigate('/profile')}>
                <img
                    src={getIconPath('profile', activePath === '/profile')}
                    alt="Profile"
                    className="icon"
                />
            </button>
        </div>
    );
};

export default Sidebar;