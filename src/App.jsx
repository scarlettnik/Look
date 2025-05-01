import {useCallback, useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';
import ProductPage from './components/ProductPage';
import TinderCards from "./components/TinderCards.jsx";
import Profile from "./components/Profile.jsx";
import Comparing from "./components/Comparing.jsx";
import Save from "./components/Save.jsx";
import Preferences from "./components/Preferences.jsx";
import ShoppingCard from "./components/ShoppingCard.jsx";
import Compilation from "./components/Сompilation.jsx";
import { AuthProvider } from "./provider/AuthProvider.jsx";
import Measurment from "./components/Measurment.jsx";
import Product from "./components/Product.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isBackHandlerActive, setIsBackHandlerActive] = useState(true);

    const isHomePage = location.pathname === '/';
    const historyState = window.history.state || {};
    const historyDepth = historyState.idx || 0;

    const handleBack = useCallback(() => {
        if (!isBackHandlerActive) return;

        setIsBackHandlerActive(false);

        if (historyDepth === 0 && isHomePage) {
            window.Telegram.WebApp.close();
        } else {
            navigate(-1);
        }

        // Восстанавливаем обработчик через короткий таймаут
        setTimeout(() => setIsBackHandlerActive(true), 300);
    }, [navigate, historyDepth, isHomePage, isBackHandlerActive]);

    useEffect(() => {
        if (!window.Telegram?.WebApp?.BackButton) return;

        const tb = window.Telegram.WebApp.BackButton;
        const shouldShow = !isHomePage || historyDepth > 0;

        // Очищаем предыдущие обработчики
        tb.offClick(handleBack);

        if (shouldShow) {
            tb.show();
            tb.onClick(handleBack);
        } else {
            tb.hide();
        }

        return () => {
            tb.offClick(handleBack);
            tb.hide();
        };
    }, [isHomePage, historyDepth, handleBack]);

    useEffect(() => {
        const handlePopState = () => {
            const newDepth = window.history.state?.idx || 0;
            if (newDepth === historyDepth) return;
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [historyDepth]);

    console.log(window.history.state?.idx)

    return (
        <div>
            {<BackButton onClick={() => navigate(-1)} />}
            <Routes>
                <Route path="/" element={<TinderCards />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/save" element={<Save />} />
                <Route path="/save/:id" element={<Compilation />} />
                <Route path="/save/:id/product/:id" element={<ProductPage />} />
                <Route path='/shoppingcard' element={<ShoppingCard />} />
                <Route path='/pref' element={<Preferences />} />
                <Route path='/compare' element={<Comparing />} />
                <Route path='/measur' element={<Measurment/>} />
                <Route path='/prod' element={<Product/>} />
            </Routes>
        </div>
    );
}

export default App;