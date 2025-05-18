
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingView } from './views/OnboardingView';
import { ProfileView } from './views/ProfileView';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProfileView />} />
        <Route path="/onboarding" element={<OnboardingView onComplete={() => {}} />} />
      </Routes>
    </Router>
  );
};

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
