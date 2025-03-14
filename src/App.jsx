import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import store from './store';
import Card from './components/Card';
import ProductPage from './components/ProductPage';

function TelegramBackButtonHandler() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (window.Telegram && window.Telegram.WebApp) {
            const { BackButton } = window.Telegram.WebApp;

           BackButton.show();

            const handleBackButtonClick = () => {
                if (window.history.length > 1) {
                    navigate(-1);
                } else {
                    console.log('Нет истории для возврата');
                    BackButton.hide();
                }
            };

            BackButton.onClick(handleBackButtonClick);

            return () => {
                BackButton.offClick(handleBackButtonClick);
                BackButton.hide();
            };
        }
    }, [navigate, location.pathname]);

    return null;
}

function App() {
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