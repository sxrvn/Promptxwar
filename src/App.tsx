import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-load heavier/less-immediately-needed routes so the initial bundle (and the home page,
// which most visitors land on) stays small. Recharts in particular is a large dependency that
// only /data actually needs.
const Phases = lazy(() => import('./pages/Phases'));
const StateDates = lazy(() => import('./pages/StateDates'));
const Wizard = lazy(() => import('./pages/Wizard'));
const Privacy = lazy(() => import('./pages/Privacy'));
const DataExplorer = lazy(() => import('./pages/DataExplorer'));

function RouteLoadingFallback() {
  return (
    <div className="flex justify-center py-24" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <ErrorBoundary>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/phases" element={<Phases />} />
              <Route path="/dates" element={<StateDates />} />
              <Route path="/wizard" element={<Wizard />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/data" element={<DataExplorer />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
