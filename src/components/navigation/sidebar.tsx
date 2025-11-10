import { useState, useEffect } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import styles from '../ui/navigation/sidebar.module.css';
import useIsKeyboardOpen from "../../hooks/useIsKeyboardOpen";
import { NAVIGATION_ICON_ASSETS, getNavigationIconPath } from "../../lib/assets";

const SIDEBAR_CONFIG = [
    { path: '/', exact: true },
    { path: '/save', matchPattern: '/save/*' },
    { path: '/trands', matchPattern: '/trands/*' },
    { path: '/shoppingcard', exact: true },
    { path: '/profile', exact: true }
];

const Sidebar = ({highlightSave, highlightPopular, onboarding}: any) => {
    const isKeyboardOpen = useIsKeyboardOpen();
    const navigate = useNavigate();
    const location = useLocation();

    const [activePath, setActivePath] = useState('/cards');
    useEffect(() => {
        setActivePath(onboarding ? '/' : '/cards');
    }, [onboarding]);


    useEffect(() => {
        const currentPath = SIDEBAR_CONFIG.find(({ path, matchPattern, exact }) => {
            return matchPattern
                ? matchPath(matchPattern, location.pathname)
                : exact
                    ? location.pathname === path
                    : location.pathname.startsWith(path);
        })?.path;

        if (currentPath) setActivePath(currentPath);
    }, [location.pathname]);

    return isKeyboardOpen ? null : (
        <div className={`${onboarding ? styles.onboarding : ''} ${styles.sidebar}`}>
            <button
                disabled={onboarding}
                className={styles.sidebarbutton}
                onClick={() => navigate('/cards')}>
                <img
                    src={getNavigationIconPath('home', activePath === '/cards')}
                    alt="Home"
                    className={styles.icon}
                />
            </button>

            <button
                disabled={onboarding}

                className={`${styles.sidebarbutton} ${activePath === '/save' ? styles.active : ''} ${highlightSave ? styles.highlight : ''}`}
                onClick={() => navigate('/save')}>
                <img
                    src={highlightSave ? NAVIGATION_ICON_ASSETS.highlight.save : getNavigationIconPath('save', activePath === '/save')}
                    alt="save"
                    className={highlightSave ? styles.highlightIcon: styles.icon}
                />
            </button>

            <button
                disabled={onboarding}
                className={`${styles.sidebarbutton} ${activePath === '/compare' ? styles.active : ''} ${highlightPopular ? styles.highlight : ''}`}
                onClick={() => navigate('/trands')}>
                <img
                    src={highlightPopular ? NAVIGATION_ICON_ASSETS.highlight.trends : getNavigationIconPath('trends', activePath === '/trands')}
                    alt="trends"
                    className={highlightPopular ? styles.highlightIcon: styles.icon}
                />
            </button>

            <button
                disabled={onboarding}

                className={`${styles.sidebarbutton} ${activePath === '/shoppingcard' ? styles.active : ''}`}
                onClick={() => navigate('/shoppingcard')}>
                <img
                    src={getNavigationIconPath('shop', activePath === '/shoppingcard')}
                    alt="Cart"
                    className={styles.icon}
                />
            </button>

            <button
                disabled={onboarding}

                className={`${styles.sidebarbutton} ${activePath === '/profile' ? styles.active : ''}`}
                onClick={() => navigate('/profile')}>
                <img
                    src={getNavigationIconPath('profile', activePath === '/profile')}
                    alt="Profile"
                    className={styles.icon}
                />
            </button>
        </div>
    );
};

export default Sidebar;
