import Card from './components/Card.jsx';
import ProductPage from './components/ProductPage.jsx';
import { Provider } from 'react-redux';
import { store } from './store';
import { Helmet } from 'react-helmet';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';


function TelegramBackButtonHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const telegram = window.Telegram.WebApp;
            if (location.pathname !== '/') {
                telegram.BackButton.show();
            } else {
                telegram.BackButton.hide();
            }

            telegram.BackButton.onClick(() => {
                navigate(-1);
            });

            const handleBackNavigation = () => {
                if (location.pathname === '/') {
                    telegram.BackButton.hide();
                } else {
                    telegram.BackButton.show();
                }
            };

            window.addEventListener('popstate', handleBackNavigation);

            return () => {
                telegram.BackButton.offClick();
                telegram.BackButton.hide();
                window.removeEventListener('popstate', handleBackNavigation);
            };
        }
    }, [navigate, location.pathname]);

    return null;
}


function App() {
    try {
        let tg = window.Telegram.WebApp;
        tg.expand();
    } catch {}

    return (

        <Provider store={store}>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </Helmet>
            <Router>
                <TelegramBackButtonHandler />
                <Routes>
                    <Route path="/" element={<Card />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;