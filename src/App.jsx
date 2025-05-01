import {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
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


const NavigationControls = () => {
    const location = useLocation();

    useEffect(() => {
        if (!window.Telegram?.WebApp) return;

        const isStartPage = location.pathname === '/'; // Укажите ваш путь стартовой страницы
        const backButton = window.Telegram.WebApp.BackButton;

        if (isStartPage) {
            backButton.hide();
            window.Telegram.WebApp.MainButton.show();
            window.Telegram.WebApp.MainButton.setParams({
                text: 'Закрыть',
                color: '#FF3B30',
            });
        } else {
            backButton.show();
            window.Telegram.WebApp.MainButton.hide();
        }

        const handleClose = () => window.Telegram.WebApp.close();
        window.Telegram.WebApp.MainButton.onClick(handleClose);

        return () => {
            window.Telegram.WebApp.MainButton.offClick(handleClose);
        };
    }, [location.pathname]);

    return null;
};


function AppContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showBackButton, setShowBackButton] = useState(false);

    useEffect(() => {
        setShowBackButton(location.key !== 'default');

        if (window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.onClick(() => navigate(-1));
            setShowBackButton(window.history.length > 1);
        }
    }, [location, navigate]);

    return (
        <div>
            <NavigationControls/>
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