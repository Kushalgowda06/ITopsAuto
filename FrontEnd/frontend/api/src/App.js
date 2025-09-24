import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DevOpsPage from './pages/DevOpsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WorkNextPage from './pages/WorkNextPage';
import ITOpsPage from './pages/ITOpsPage';
import ITSMPage from './pages/ITSMPage';
import ChatbotPage from './pages/ChatbotPage';
import ChangeAssistPage from './pages/ChangeAssistPage';
import ChangeGeneratePage from './pages/ChangeGeneratePage';
import NewKnowledgeAssistPage from './pages/NewKnowledgeAssistPage';
import './index.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Public Route Component (redirect to dashboard if authenticated)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-dark-950">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#f8fafc',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            {/* <Route path="/" element={<LandingPage />} /> */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/devops" 
              element={
                <ProtectedRoute>
                  <DevOpsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worknext" 
              element={
                <ProtectedRoute>
                  <WorkNextPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/itops" 
              element={
                <ProtectedRoute>
                  <ITOpsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/itsm" 
              element={
                <ProtectedRoute>
                  <ITSMPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/chat/:botId" 
              element={
                <ProtectedRoute>
                  <ChatbotPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/change-assist" 
              element={
                <ProtectedRoute>
                  <ChangeAssistPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/change-assist/generate" 
              element={
                <ProtectedRoute>
                  <ChangeGeneratePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/knowledge-assist/*" 
              element={
                <ProtectedRoute>
                  <NewKnowledgeAssistPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 