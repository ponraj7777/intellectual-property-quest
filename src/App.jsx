import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MeshBackground from './components/MeshBackground';
import ChatBot from './components/ChatBot';

import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleDetail from './pages/ModuleDetail';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import QuestionManager from './pages/QuestionManager';
import AdminLogin from './pages/AdminLogin';

import { GameProvider, useGame } from './hooks/useGame';
import { ThemeProvider } from './context/ThemeContext';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useGame();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-quest-primary"></div>
    </div>
  );

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen text-quest-text font-sans flex flex-col relative transition-colors duration-300">
            <MeshBackground />
            <Toaster theme="dark" position="top-center" />
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/modules" element={<Modules />} />
                <Route path="/modules/:moduleId" element={<ModuleDetail />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/admin/questions"
                  element={
                    <AdminProtectedRoute>
                      <QuestionManager />
                    </AdminProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
            <ChatBot />
          </div>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
