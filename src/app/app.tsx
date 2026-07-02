import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';
import {useEffect, useRef} from 'react';
import ProductPage from '../components/catalog/product/productPage';
import TinderCards from "../components/catalog/cards/tinderCards";
import Profile from "../components/profile/profile";
import Comparing from "../components/catalog/compare/comparing";
import Save from "../components/collections/save";
import ShoppingCard from "../components/shopping/shoppingCard";
import Compilation from "../components/catalog/collection/compilation";
import { AuthProvider } from "./providers/authProvider";
import AddList from "../components/collections/addList";
import { StoreProvider } from './providers/storeProvider';
import OnboardingModal from "../components/onboarding/onboardingModal";
import AccountDeleted from "../components/account/accountDeleted";
import PopularCollection from "../components/catalog/trends/popularCollection";
import {
    getTelegramStartParam,
    getTelegramWebApp,
    isTelegramBackButtonSupported,
    isTelegramEnvironment,
} from '../lib/telegramWebApp';

function App() {
    return (
        <StoreProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </StoreProvider>
    );
}

function AppContent() {
    const navigate = useNavigate();
    const hasRedirected = useRef(false);

    const isTWA = isTelegramEnvironment();
    const startParamFromInitData = getTelegramStartParam();
    const showTelegramBackButton =
        window.history.state?.idx > 0 && isTelegramBackButtonSupported();

    useEffect(() => {
        if (!isTWA) return;

        const tgWebApp = getTelegramWebApp();
        if (!tgWebApp) {
            return;
        }

        tgWebApp.ready();
        tgWebApp.disableVerticalSwipes();
        tgWebApp.expand();
    }, [isTWA]);

    useEffect(() => {
        if (hasRedirected.current) {
            return;
        }

        if (startParamFromInitData && startParamFromInitData.startsWith('collection_')) {
            const collectionId = startParamFromInitData.split('_')[1];
            hasRedirected.current = true;
            navigate(`/trands/collection/${collectionId}`, { replace: true });
        }
    }, [startParamFromInitData, navigate]);

    return (
        <div>
            {showTelegramBackButton && <BackButton onClick={() => navigate(-1)} />}
            <Routes>
                <Route path="/add" element={<AddList/>}/>
                <Route path="/cards" element={<TinderCards/>}/>
                <Route path="/" element={<OnboardingModal/>}/>
                <Route path="/product/:id" element={<ProductPage/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/save" element={<Save/>}/>
                <Route path="/save/:id" element={<Compilation/>}/>
                <Route path="/collection/:id" element={<Compilation/>}/>
                <Route path="/save/:id/product/:id" element={<ProductPage/>}/>
                <Route path="/trands/product/:id" element={<ProductPage/>}/>
                <Route path='/shoppingcard' element={<ShoppingCard/>}/>
                <Route path='/trands' element={<Comparing/>}/>
                <Route path='/trands/:id' element={<PopularCollection/>}/>
                <Route path='/trands/collection/:id' element={<Compilation/>}/>
                <Route path='/trands/collection/:id/product/:id' element={<ProductPage/>}/>
                <Route path="/account-deleted" element={<AccountDeleted />} />
            </Routes>
        </div>
    );
}

export default App;
