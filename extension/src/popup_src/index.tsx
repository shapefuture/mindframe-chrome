
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  console.debug('[Popup] App wrapped in ErrorBoundary and mounted to #root');
} from './views/ProfileView';

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
