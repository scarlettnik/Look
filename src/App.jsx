import {useEffect, useState} from 'react';
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
    const [showBackButton, setShowBackButton] = useState(false);

    const hasHistory = window.history.length > 1;

    useEffect(() => {
        const isHomePage = location.pathname === '/';

        setShowBackButton(!isHomePage || hasHistory);

        if (window.Telegram?.WebApp?.BackButton) {
            const tb = window.Telegram.WebApp.BackButton;

            if (showBackButton) {
                tb.show();
                tb.onClick(() => {
                    if (isHomePage && !hasHistory) {
                        window.Telegram.WebApp.close();
                    } else {
                        navigate(-1);
                    }
                });
            } else {
                tb.hide();
            }

            return () => tb.offClick();
        }
    }, [location, navigate, hasHistory, showBackButton]);

    useEffect(() => {
        const handlePopState = () => {
            setShowBackButton(window.history.length > 1);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    console.log(window.history.length)

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