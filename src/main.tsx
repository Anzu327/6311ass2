import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import TrackingCheck from './TrackingCheck';
createRoot(document.getElementById('root')!).render(<React.StrictMode>{import.meta.env.DEV && new URLSearchParams(location.search).has('qa-tracking') ? <TrackingCheck /> : <App />}</React.StrictMode>);
