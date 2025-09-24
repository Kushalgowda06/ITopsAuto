import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Form, Button, Alert, InputGroup } from 'react-bootstrap';

import { 
  HiPlus, 
  HiArrowUpTray, 
  HiChartBarSquare, 
  HiArrowDownTray, 
  HiLightBulb,
  HiArrowsRightLeft,
  HiUsers,
  HiCalendarDays,
  HiMagnifyingGlass,
  HiBolt,
  HiCog6Tooth,
  HiCircleStack,
  HiQuestionMarkCircle,
  HiGlobeAlt,
  HiCheckCircle,
  HiDocumentText,
  HiMicrophone,
  HiSpeakerXMark,
  HiShieldCheck,
  HiCloud
} from 'react-icons/hi2';
import { FaWindows, FaLinux, FaAws, FaMicrosoft } from 'react-icons/fa';
import { SiGooglecloud } from 'react-icons/si';
import { FaBrain } from "react-icons/fa6";


// Icon mapping function
const getIconComponent = (iconName) => {
  const iconMap = {
    'FaWindows': FaWindows,
    'FaLinux': FaLinux,
    'HiGlobeAlt': HiGlobeAlt,
    'HiCircleStack': HiCircleStack,
    'HiCog6Tooth': HiCog6Tooth,
    'FaAws': FaAws,
    'FaMicrosoft': FaMicrosoft,
    'SiGooglecloud': SiGooglecloud,
    'HiShieldCheck': HiShieldCheck,
    'HiCloud': HiCloud
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : <HiLightBulb />;
};

const Dashboard = ({ categories, onCategoryClick }) => {
  const navigate = useNavigate();
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [newSOP, setNewSOP] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    tags: '',
    steps: ''
  });

  // Progressive color palette from low to high intensity
  const getProgressiveColor = (index, total) => {
    const colorPalette = [
      '#E3F2FD', // Very light blue
      '#BBDEFB', // Light blue
      '#90CAF9', // Medium light blue
      '#64B5F6', // Medium blue
      '#42A5F5', // Medium dark blue
      '#2196F3', // Blue
      '#1E88E5', // Dark blue
      '#1976D2', // Darker blue
      '#1565C0'  // Very dark blue
    ];
    
    if (total <= colorPalette.length) {
      return colorPalette[index] || colorPalette[colorPalette.length - 1];
    } else {
      // For more categories, interpolate colors
      const intensity = (index / (total - 1)) * (colorPalette.length - 1);
      const baseIndex = Math.floor(intensity);
      const nextIndex = Math.min(baseIndex + 1, colorPalette.length - 1);
      return colorPalette[nextIndex] || colorPalette[colorPalette.length - 1];
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  // Search and voice functionality
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchInput(transcript);
        setSearchQuery(transcript);
        setIsListening(false);
      };
      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);
      
      setRecognition(recognitionInstance);
    }

    // Listen for sidebar quick action events
    const handleOpenAddSOPModal = () => {
      setShowAddModal(true);
    };

    const handleOpenExportModal = () => {
      setShowExportModal(true);
    };

    window.addEventListener('openAddSOPModal', handleOpenAddSOPModal);
    window.addEventListener('openExportModal', handleOpenExportModal);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('openAddSOPModal', handleOpenAddSOPModal);
      window.removeEventListener('openExportModal', handleOpenExportModal);
    };
  }, []);

  const handleCategoryClick = (category) => {
    const element = document.querySelector(`[data-category-id="${category.id}"]`);
    if (element) {
      element.style.transform = 'scale(0.95)';
      setTimeout(() => {
        element.style.transform = '';
        onCategoryClick(category);
        navigate(`/category/${category.id}`);
      }, 150);
    } else {
      onCategoryClick(category);
      navigate(`/category/${category.id}`);
    }
  };

  const getCategoryClassName = (categoryName) => {
    return `theme-category-card ${categoryName.toLowerCase()}`;
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setSearchQuery(value);
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const handleAddNewSOP = () => setShowAddModal(true);
  const handleImportDocs = () => setShowImportModal(true);
  const handleViewReports = () => navigate('/analytics');
  const handleExportData = () => setShowExportModal(true);

  const handleSaveNewSOP = () => {
    showNotification('New SOP created successfully!');
    setShowAddModal(false);
    setNewSOP({ title: '', description: '', category: '', priority: 'Medium', tags: '', steps: '' });
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    showNotification(`${files.length} document(s) imported successfully!`);
    setShowImportModal(false);
  };

  const exportData = (format) => {
    showNotification(`Data exported as ${format} successfully!`);
    setShowExportModal(false);
  };

  return (
    <Container fluid className="theme-fade-in" style={{ padding: '1rem 1.5rem' }}>
      {notification && (
        <Alert variant="success" className="alert-dismissible fade show compact" role="alert" style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <HiCheckCircle className="me-2" style={{ fontSize: '1rem' }} />
          {notification}
        </Alert>
      )}

      {/* Hero Section */}
      <div className="theme-page-header theme-text-center theme-mb-lg py-2">
        <h1 className="theme-page-title text-center d-flex align-items-center justify-content-center" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          <FaBrain style={{ color: 'var(--primary-color)', marginRight: '0.5rem', fontSize: '1.6rem' }} />
          Knowledge Curation Dashboard
        </h1>
        <p className="theme-page-subtitle text-center" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
          Your comprehensive IT documentation and SOP management platform
        </p>
        
        {/* Search Bar */}
        <div className="d-flex justify-content-center mt-3 mb-3 hero-search">
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <InputGroup>
              <InputGroup.Text style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                border: '1px solid rgba(0, 123, 255, 0.3)',
                borderRight: 'none',
                padding: '0.5rem 0.75rem'
              }}>
                <HiMagnifyingGlass style={{ color: 'var(--primary-color)', fontSize: '1rem' }} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search documentation, SOPs, categories..."
                value={searchInput}
                onChange={handleSearchChange}
                style={{
                  border: '1px solid rgba(0, 123, 255, 0.3)',
                  borderLeft: 'none',
                  borderRight: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.95rem',
                  padding: '0.5rem 0.75rem'
                }}
              />
              {recognition && (
                <InputGroup.Text 
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    border: '1px solid rgba(0, 123, 255, 0.3)',
                    borderLeft: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem 0.75rem'
                  }}
                  onClick={isListening ? stopListening : startListening}
                  title={isListening ? "Stop Voice Search" : "Start Voice Search"}
                >
                  {isListening ? (
                    <HiSpeakerXMark style={{ color: 'var(--danger-color)', fontSize: '1rem' }} />
                  ) : (
                    <HiMicrophone style={{ color: 'var(--primary-color)', fontSize: '1rem' }} />
                  )}
                </InputGroup.Text>
              )}
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="theme-mb-lg">
        <Col md={4} className="mb-3">
          <div 
            className="theme-kpi-card compact"
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => navigate('/knowledge-assist')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="theme-kpi-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              <FaBrain />
            </div>
            <div className="theme-kpi-value" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Knowledge</div>
            <div className="theme-kpi-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Assist</div>
            <p className="text-center mt-1 text-muted small" style={{ fontSize: '0.8rem', marginBottom: '0' }}>
              Comprehensive documentation and SOP management
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div 
            className="theme-kpi-card compact"
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => navigate('/transition-assist')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="theme-kpi-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              <HiArrowsRightLeft />
            </div>
            <div className="theme-kpi-value" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Transition</div>
            <div className="theme-kpi-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Assist</div>
            <p className="text-center mt-1 text-muted small" style={{ fontSize: '0.8rem', marginBottom: '0' }}>
              Smooth project handovers and knowledge transfer
            </p>
          </div>
        </Col>
        <Col md={4} className="mb-3">
          <div 
            className="theme-kpi-card compact"
            style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            onClick={() => navigate('/meeting-assist')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="theme-kpi-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              <HiCalendarDays />
            </div>
            <div className="theme-kpi-value" style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>Meeting</div>
            <div className="theme-kpi-label" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Assist</div>
            <p className="text-center mt-1 text-muted small" style={{ fontSize: '0.8rem', marginBottom: '0' }}>
              Intelligent meeting management and productivity insights
            </p>
          </div>
        </Col>
      </Row>

      {/* Search Results Header */}
      {searchQuery && (
        <div className="theme-card theme-mb-md">
          <div className="theme-card-body" style={{ padding: '1rem' }}>
            <h5 className="theme-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              <HiMagnifyingGlass style={{ marginRight: '0.5rem' }} />
              Search Results for "{searchQuery}"
            </h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Found {filteredCategories.length} categories</p>
          </div>
        </div>
      )}

      {/* Categories Section Title */}
      {!searchQuery && (
        <div className="text-center mb-4">
          <h2 className="theme-section-title" style={{ 
            color: 'var(--text-primary)', 
            fontWeight: 'bold',
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }}>
            Browse Knowledge Articles by Categories
          </h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Select a category to explore our comprehensive documentation library
          </p>
        </div>
      )}

      {/* Categories Grid */}
      <Row className="theme-mb-lg">
        {filteredCategories.map((category, index) => (
          <Col lg={4} md={6} className="mb-3" key={category.id}>
            <div
              className={`${getCategoryClassName(category.name)} compact`}
              style={{ 
                '--category-color': category.color,
                animationDelay: `${index * 0.1}s` 
              }}
              data-category-id={category.id}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="theme-category-icon" style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>
                {getIconComponent(category.icon)}
              </div>
              <h3 className="theme-category-title" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{category.name}</h3>
              <p className="theme-category-description" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>{category.description}</p>
              <div className="theme-category-count" style={{ fontSize: '0.9rem' }}>
                {category.count} SOPs
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* No Results */}
      {filteredCategories.length === 0 && searchQuery && (
        <div className="theme-card theme-text-center compact">
          <div className="theme-card-body" style={{ padding: '2rem 1rem' }}>
            <HiMagnifyingGlass className="text-muted mb-3" style={{ fontSize: '2.5rem' }} />
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No categories found</h4>
            <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0' }}>Try adjusting your search terms</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="theme-card theme-mb-lg">
        <div className="theme-card-header" style={{ padding: '1rem 1.5rem 0.5rem' }}>
          <h5 className="theme-card-title" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
            <HiBolt style={{ marginRight: '0.5rem' }} />
            Quick Actions
          </h5>
        </div>
        <div className="theme-card-body" style={{ padding: '1rem 1.5rem 1.5rem' }}>
          <Row>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-primary w-100 compact" onClick={handleAddNewSOP} style={{ 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.85rem',
                background: 'linear-gradient(90deg, #093ADA 0%, #0546EA 50%, #0081FA 100%)',
                border: 'none',
                color: 'white'
              }}>
                <HiPlus style={{ marginRight: '0.25rem', fontSize: '0.9rem' }} /> Add New SOP
              </button>
            </Col>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-primary w-100 compact" onClick={handleImportDocs} style={{ 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.85rem',
                background: 'linear-gradient(90deg, #093ADA 0%, #0546EA 50%, #0081FA 100%)',
                border: 'none',
                color: 'white'
              }}>
                <HiArrowUpTray style={{ marginRight: '0.25rem', fontSize: '0.9rem' }} /> Import Docs
              </button>
            </Col>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-primary w-100 compact" onClick={handleViewReports} style={{ 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.85rem',
                background: 'linear-gradient(90deg, #093ADA 0%, #0546EA 50%, #0081FA 100%)',
                border: 'none',
                color: 'white'
              }}>
                <HiChartBarSquare style={{ marginRight: '0.25rem', fontSize: '0.9rem' }} /> View Analytics
              </button>
            </Col>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-primary w-100 compact" onClick={handleExportData} style={{ 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.85rem',
                background: 'linear-gradient(90deg, #093ADA 0%, #0546EA 50%, #0081FA 100%)',
                border: 'none',
                color: 'white'
              }}>
                <HiArrowDownTray style={{ marginRight: '0.25rem', fontSize: '0.9rem' }} /> Export Data
              </button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-secondary w-100 compact" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                <HiUsers className="me-1" style={{ fontSize: '0.9rem' }} /> User Management
              </button>
            </Col>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-secondary w-100 compact" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                <HiCog6Tooth className="me-1" style={{ fontSize: '0.9rem' }} /> Settings
              </button>
            </Col>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-secondary w-100 compact" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                <HiCircleStack className="me-1" style={{ fontSize: '0.9rem' }} /> Backup
              </button>
            </Col>
            <Col md={3} className="mb-2">
              <button className="theme-btn theme-btn-secondary w-100 compact" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                <HiQuestionMarkCircle className="me-1" style={{ fontSize: '0.9rem' }} /> Help
              </button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modals */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiPlus className="me-2" /> Create New SOP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SOP Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter SOP title"
                    value={newSOP.title}
                    onChange={(e) => setNewSOP({...newSOP, title: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newSOP.category}
                    onChange={(e) => setNewSOP({...newSOP, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Brief description of the SOP"
                value={newSOP.description}
                onChange={(e) => setNewSOP({...newSOP, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newSOP.priority}
                    onChange={(e) => setNewSOP({...newSOP, priority: e.target.value})}
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter tags (comma separated)"
                    value={newSOP.tags}
                    onChange={(e) => setNewSOP({...newSOP, tags: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>SOP Steps</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Enter detailed steps for this SOP (one step per line)"
                value={newSOP.steps}
                onChange={(e) => setNewSOP({...newSOP, steps: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveNewSOP}
            style={{ background: 'var(--bg-gradient)', border: 'none' }}
          >
            <HiPlus className="me-2" /> Create SOP
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Import Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiArrowUpTray className="me-2" /> Import Documents
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Select files to import into the knowledge base:</p>
          <Form.Control
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.md"
            onChange={handleFileUpload}
          />
          <small className="text-muted mt-2 d-block">
            Supported formats: PDF, DOC, DOCX, TXT, MD
          </small>
        </Modal.Body>
      </Modal>

      {/* Export Modal */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiArrowDownTray className="me-2" /> Export Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Choose export format:</p>
          <div className="d-grid gap-2">
            <Button variant="outline-primary" onClick={() => exportData('PDF')}>
              <HiDocumentText className="me-2" /> Export as PDF
            </Button>
            <Button variant="outline-primary" onClick={() => exportData('Excel')}>
              <HiDocumentText className="me-2" /> Export as Excel
            </Button>
            <Button variant="outline-primary" onClick={() => exportData('CSV')}>
              <HiDocumentText className="me-2" /> Export as CSV
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard; 