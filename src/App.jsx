import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Card from './components/Card.jsx';
import ProductPage from './components/ProductPage.jsx';
import { Provider } from 'react-redux';
import { store } from './store';
import { Helmet } from 'react-helmet';


function App() {
    // try {
    //     let tg = window.Telegram.WebApp;
    //     tg.expand();
    // } catch {}

    return (

        <Provider store={store}>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
            </Helmet>
            <Router>
                <Routes>
                    <Route path="/" element={<Card />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;