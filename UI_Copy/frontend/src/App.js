// import React from 'react';
import React, { useState } from 'react';
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
// import NewKnowledgeAssistPage from './pages/NewKnowledgeAssistPage';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';



import Navbar from './knowledgeCuration/src/components/Navbar';
import Sidebar from './knowledgeCuration/src/components/Sidebar';
// import Dashboard from './knowledgeCuration/src/components/Dashboard';
import CategoryView from './knowledgeCuration/src/components/CategoryView';
import SOPModal from './knowledgeCuration/src/components/SOPModal';
import Analytics from './knowledgeCuration/src/components/Analytics';
import KnowledgeAssist from './knowledgeCuration/src/components/KnowledgeAssist';
import TransitionAssist from './knowledgeCuration/src/components/TransitionAssist';
import MeetingAssist from './knowledgeCuration/src/components/MeetingAssist';
import Footer from './knowledgeCuration/src/components/Footer';

// Data
import { categories, sopsData } from './data/dummyData';
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [isSOPModalOpen, setIsSOPModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSops, setCurrentSops] = useState(sopsData);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const updateSOPs = (newSOP, selectedSopId = categories.length) => {
    if (selectedSopId == categories.length) {
      let tempSop1 = { ...currentSops }
      tempSop1[currentSops.length + 1] = [{ ...newSOP }]
      setCurrentSops(tempSop1)
    } else {
      let tempSop2 = { ...currentSops }
      tempSop2[selectedSopId] = [...tempSop2[selectedSopId], { ...newSOP }]
      setCurrentSops(tempSop2)
    }

  }

  console.log(currentSops, "currentSops")

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedCategory(null);
    setSelectedSOP(null);
    setIsSOPModalOpen(false);
    setSearchQuery('');
    setCurrentSops(sopsData);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSOP(null);
  };

  const handleSOPClick = (sop) => {
    setSelectedSOP(sop);
    setIsSOPModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSOPModalOpen(false);
    setSelectedSOP(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter SOPs based on search query
    if (query.trim() === '') {
      setCurrentSops(sopsData);
      return;
    }

    const filteredSops = {};
    Object.keys(sopsData).forEach(categoryId => {
      const filtered = sopsData[categoryId].filter(sop =>
        sop.title.toLowerCase().includes(query.toLowerCase()) ||
        sop.description.toLowerCase().includes(query.toLowerCase()) ||
        sop.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      if (filtered.length > 0) {
        filteredSops[categoryId] = filtered;
      }
    });
    setCurrentSops(filteredSops);
  };

  const handleSOPUpdate = (updatedSOP, categoryId) => {
    const newSops = { ...currentSops };
    if (newSops[categoryId]) {
      const index = newSops[categoryId].findIndex(sop => sop.id === updatedSOP.id);
      if (index !== -1) {
        newSops[categoryId][index] = updatedSOP;
      } else {
        newSops[categoryId].push(updatedSOP);
      }
      setCurrentSops(newSops);
    }
  };

  const handleSOPDelete = (sopId, categoryId) => {
    const newSops = { ...currentSops };
    if (newSops[categoryId]) {
      newSops[categoryId] = newSops[categoryId].filter(sop => sop.id !== sopId);
      setCurrentSops(newSops);
    }
  };

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
            {/* <Route
              path="/knowledge-assist/*"
              element={
                <ProtectedRoute>
                  <NewKnowledgeAssistPage />
                </ProtectedRoute>
              }
            /> */}

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />

            {/* <Routes> */}
            {/* <Route
                path="/"
                element={
                  <Dashboard
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                  />
                }
              /> */}
            <Route
              path="/category/:id"
              element={
                <CategoryView
                  category={selectedCategory}
                  sops={selectedCategory ? currentSops[selectedCategory.id] || [] : []}
                  onSOPClick={handleSOPClick}
                  onSOPUpdate={handleSOPUpdate}
                  onSOPDelete={handleSOPDelete}
                />
              }
            />
            <Route
              path="/analytics"
              element={<Analytics />}
            />
            <Route
              path="/knowledge-assist"
              element={
                <ProtectedRoute>
                  <main className="main-content">
                    <Navbar />
                    <KnowledgeAssist categories={categories} onCategoryClick={handleCategoryClick} updateSOPs={updateSOPs} />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/transition-assist"
              element={<TransitionAssist />}
            />
            <Route
              path="/meeting-assist"
              element={<MeetingAssist />}
            />


          </Routes>
          <SOPModal
            isOpen={isSOPModalOpen}
            onClose={handleCloseModal}
            sop={selectedSOP}
            onUpdate={handleSOPUpdate}
            onDelete={handleSOPDelete}
            categoryId={selectedCategory?.id}
          />

        </div>


        <div className="App">
          {/* <Navbar
            onLogout={handleLogout}
          /> */}
          {/* <Sidebar 
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                  /> */}
          {/* <main className="main-content">

          </main> */}



          {/* <Footer /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 