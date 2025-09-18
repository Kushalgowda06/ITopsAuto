import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CategoryView from './components/CategoryView';
import SOPModal from './components/SOPModal';
import Analytics from './components/Analytics';
import KnowledgeAssist from './components/KnowledgeAssist';
import TransitionAssist from './components/TransitionAssist';
import MeetingAssist from './components/MeetingAssist';
import Footer from './components/Footer';

// Data
import { categories, sopsData } from './data/dummyData';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Gellix-Regular", "Gellix", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

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

  // Show login page if not authenticated

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar 
            onLogout={handleLogout}
          />
          {/* <Sidebar 
            categories={categories}
            onCategoryClick={handleCategoryClick}
          /> */}
          <main className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    categories={categories}
                    onCategoryClick={handleCategoryClick}
                  />
                } 
              />
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
                  element={<KnowledgeAssist categories={categories} onCategoryClick={handleCategoryClick} />}
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
          </main>
          
          <SOPModal
            isOpen={isSOPModalOpen}
            onClose={handleCloseModal}
            sop={selectedSOP}
            onUpdate={handleSOPUpdate}
            onDelete={handleSOPDelete}
            categoryId={selectedCategory?.id}
          />
          
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 