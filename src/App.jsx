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

    const handleBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        if (!window.Telegram?.WebApp?.BackButton) return;

        const tb = window.Telegram.WebApp.BackButton;
        const isInitialPage = location.pathname === '/';

        isInitialPage ? tb.hide() : tb.show();

        tb.onClick(handleBack);

        return () => {
            tb.offClick(handleBack);
        };
    }, [location.pathname, handleBack]);

    return (
        <div>
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