import ReactDOM from 'react-dom/client';
import App from './app/app';
import { DEFERRED_IMAGE_ASSETS } from './lib/assets';
import { warmImageAssets } from './lib/assetPreloader';
import { ensureTelegramWebApp } from './lib/telegramWebApp';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element was not found');
}

ensureTelegramWebApp();
warmImageAssets(DEFERRED_IMAGE_ASSETS);

ReactDOM.createRoot(rootElement).render(<App />);
