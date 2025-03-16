import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { BackButton } from '@twa-dev/sdk/react';
import Card from './components/Card';
import ProductPage from './components/ProductPage';
import {store} from "./store.js";


function App() {
    return (
        <Provider store={store}>
            <Router>
                <AppContent />
            </Router>
        </Provider>
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
                <Route path="/" element={<Card />} />
                <Route path="/product/:id" element={<ProductPage />} />
            </Routes>
        </div>
    );
}

export default App;