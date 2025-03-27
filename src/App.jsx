import React, {useEffect, useState, useCallback} from 'react';
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

    const showBackButton = location.pathname !== '/';

    return (
        <div>
            {showBackButton && <BackButton onClick={() => navigate(-1)} />}
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
            </Routes>
        </div>
    );
}

export default App;