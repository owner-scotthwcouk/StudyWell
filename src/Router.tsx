import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import PortalApp from './PortalApp';
import { UserProvider } from './context/UserContext';

// All routes are now public, so no special wrapper components are needed.
const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/portal" element={<PortalApp />} />

                {/* Fallback route redirects to the main app page */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

const Router: React.FC = () => {
    return (
        <UserProvider>
            <AppRoutes />
        </UserProvider>
    );
};

export default Router;