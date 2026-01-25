import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Leaderboard from './pages/Leaderboard';

import { GameProvider } from './hooks/useGame';

function App() {
  return (
    <GameProvider>
      <Router>
        <div className="min-h-screen bg-quest-dark text-white font-sans selection:bg-quest-primary selection:text-white flex flex-col">
          <Toaster theme="dark" position="top-center" />
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;
