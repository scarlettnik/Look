import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Card from './components/Card.jsx';
import ProductPage from './components/ProductPage.jsx';
import { Provider } from 'react-redux';
import { store } from './store';
import { WebApp } from '@twa-dev/sdk';

function App() {
    // useEffect(() => {
    //     WebApp.ready();
    //     WebApp.expand();
    // }, []);

    return (
        <Provider store={store}>
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