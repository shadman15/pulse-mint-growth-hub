import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { trackOutboundClicks } from './lib/trackClicks'
import './index.css'

trackOutboundClicks();

createRoot(document.getElementById("root")!).render(<App />);
