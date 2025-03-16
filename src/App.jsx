import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { BackButton, MainButton } from '@twa-dev/sdk/react';

import HomePage from './components/HomePage';
import SecondPage from './components/SecondPage';

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
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
                <Route path="/" element={<HomePage />} />
                <Route path="/second" element={<SecondPage />} />
            </Routes>
        </div>
    );
}

export default App;