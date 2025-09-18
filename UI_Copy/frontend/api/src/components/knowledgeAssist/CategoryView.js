import React, { useState } from 'react';
import { Container, Row, Col, Modal, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Card, CardContent, Typography, Chip, IconButton, Fab, Tooltip, Avatar } from '@mui/material';
import { 
  HiArrowLeft, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiMagnifyingGlass, 
  HiFunnel, 
  HiArrowTrendingUp, 
  HiSignal,
  HiFolderOpen,
  HiEye,
  HiDocumentText,
  HiGlobeAlt,
  HiCircleStack,
  HiCog6Tooth,
  HiShieldCheck,
  HiCloud
} from 'react-icons/hi2';
import { FaWindows, FaLinux, FaAws, FaMicrosoft } from 'react-icons/fa';
import { SiGooglecloud } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

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
  return IconComponent ? <IconComponent /> : <HiFolderOpen />;
};

const CategoryView = ({ category, sops, onSOPClick, onSOPUpdate, onSOPDelete }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSOP, setEditingSOP] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [notification, setNotification] = useState('');
  const [newSOP, setNewSOP] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    author: 'Current User',
    tags: '',
    steps: ''
  });

  if (!category) {
    return (
      <Container fluid className="text-center py-5">
        <div className="quick-actions-card p-5">
          <HiFolderOpen className="fa-4x text-muted mb-4" style={{ fontSize: '4rem' }} />
          <Typography variant="h5" className="text-dark mb-3">
            Please select a category from the sidebar or dashboard
          </Typography>
          <Button variant="primary" onClick={() => navigate('/')}>
            <HiArrowLeft className="me-2" />
            Return to Dashboard
          </Button>
        </div>
      </Container>
    );
  }

  const handleBack = () => {
    navigate('/');
  };

  const filteredSops = sops.filter(sop => {
    if (filterPriority === 'all') return true;
    return sop.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  const sortedSops = [...filteredSops].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'lastUpdated':
      default:
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
  });

  const handleAddSOP = () => {
    const sopData = {
      id: Date.now(),
      title: newSOP.title,
      description: newSOP.description,
      category: newSOP.category,
      priority: newSOP.priority,
      lastUpdated: new Date().toISOString().split('T')[0],
      author: newSOP.author,
      tags: newSOP.tags.split(',').map(tag => tag.trim()),
      steps: newSOP.steps.split('\n').filter(step => step.trim())
    };
    
    onSOPUpdate(sopData, category.id);
    setShowAddModal(false);
    setNotification('✅ SOP created successfully!');
    setTimeout(() => setNotification(''), 3000);
    setNewSOP({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      author: 'Current User',
      tags: '',
      steps: ''
    });
  };

  const handleEditSOP = (sop) => {
    setEditingSOP(sop);
    setNewSOP({
      title: sop.title,
      description: sop.description,
      category: sop.category,
      priority: sop.priority,
      author: sop.author,
      tags: sop.tags.join(', '),
      steps: sop.steps.join('\n')
    });
    setShowAddModal(true);
  };

  const handleUpdateSOP = () => {
    const sopData = {
      ...editingSOP,
      title: newSOP.title,
      description: newSOP.description,
      category: newSOP.category,
      priority: newSOP.priority,
      lastUpdated: new Date().toISOString().split('T')[0],
      author: newSOP.author,
      tags: newSOP.tags.split(',').map(tag => tag.trim()),
      steps: newSOP.steps.split('\n').filter(step => step.trim())
    };
    
    onSOPUpdate(sopData, category.id);
    setShowAddModal(false);
    setEditingSOP(null);
    setNotification('✅ SOP updated successfully!');
    setTimeout(() => setNotification(''), 3000);
    setNewSOP({
      title: '',
      description: '',
      category: '',
      priority: 'Medium',
      author: 'Current User',
      tags: '',
      steps: ''
    });
  };

  const handleDeleteSOP = (sopId) => {
    if (window.confirm('Are you sure you want to delete this SOP?')) {
      onSOPDelete(sopId, category.id);
      setNotification('🗑️ SOP deleted successfully!');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRandomMetrics = () => ({
    completionRate: Math.floor(Math.random() * 30) + 70,
    views: Math.floor(Math.random() * 500) + 50,
    lastAccessed: Math.floor(Math.random() * 7) + 1
  });

  return (
    <Container fluid className="fade-in">
      {/* Notification Alert */}
      {notification && (
        <Alert 
          variant="success" 
          className="fixed-top mx-auto mt-3" 
          style={{ 
            width: 'fit-content',
            zIndex: 9999,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            border: 'none',
            color: 'white',
            fontWeight: 600
          }}
          dismissible 
          onClose={() => setNotification('')}
        >
          {notification}
        </Alert>
      )}

      {/* Enhanced Header */}
      <Row className="mb-4">
        <Col>
          <Card className="quick-actions-card">
            <CardContent>
              <div className="d-flex align-items-center mb-4">
                <Tooltip title="Back to Dashboard">
                  <IconButton 
                    onClick={handleBack} 
                    className="me-3"
                    style={{
                      background: `linear-gradient(135deg, ${category.color}90 0%, ${category.color}90 100%)`,
                      color: 'white'
                    }}
                  >
                    <HiArrowLeft />
                  </IconButton>
                </Tooltip>
                
                <div 
                  className="d-flex align-items-center me-4"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}30 100%)`,
                    padding: '15px 20px',
                    borderRadius: '15px',
                    border: `2px solid ${category.color}40`
                  }}
                >
                  <div className="me-3" style={{ fontSize: '2.5rem', color: category.color }}>
                    {getIconComponent(category.icon)}
                  </div>
                  <div>
                    <Typography variant="h4" className="mb-1" style={{ color: category.color, fontWeight: 700 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body1" className="text-muted">{category.description}</Typography>
                  </div>
                </div>
                
                <div className="ms-auto">
                  <Badge bg="primary" className="me-2 p-2">
                    <HiDocumentText className="me-1" />
                    {sops.length} SOPs
                  </Badge>
                  <Badge bg="success" className="p-1 px-2">
                    <HiArrowTrendingUp className="me-1" />
                    Active
                  </Badge>
                </div>
              </div>
              
              {/* Enhanced Filters and Sort */}
              <Row className="align-items-center">
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <HiFunnel className="me-2" style={{ color: category.color }} />
                    <Form.Select 
                      size="sm" 
                      value={filterPriority} 
                      onChange={(e) => setFilterPriority(e.target.value)}
                      style={{ 
                        borderColor: category.color + '40',
                        borderRadius: '10px',
                        fontWeight: 500
                      }}
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">🔴 High Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="low">🟢 Low Priority</option>
                    </Form.Select>
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    size="sm" 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ 
                      borderColor: category.color + '40',
                      borderRadius: '10px',
                      fontWeight: 500
                    }}
                  >
                    <option value="lastUpdated">📅 Sort by Last Updated</option>
                    <option value="title">🔤 Sort by Title</option>
                    <option value="priority">⚡ Sort by Priority</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center text-muted">
                    <HiSignal className="me-2" />
                    <small>Avg. completion: {Math.floor(Math.random() * 30) + 70}%</small>
                  </div>
                </Col>
                <Col md={3} className="text-end">
                  <Typography variant="body2" className="text-muted">
                    <strong>{filteredSops.length}</strong> of <strong>{sops.length}</strong> items
                    {filterPriority !== 'all' && (
                      <Badge bg="secondary" className="ms-2">
                        {filterPriority} filter
                      </Badge>
                    )}
                  </Typography>
                </Col>
              </Row>
            </CardContent>
          </Card>
        </Col>
      </Row>

      {/* Enhanced SOPs Grid */}
      <Row>
        {sortedSops.map((sop, index) => {
          const metrics = getRandomMetrics();
          return (
            <Col lg={6} className="mb-4" key={sop.id}>
              <Card 
                className="sop-card h-100"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  border: `1px solid ${category.color}20`
                }}
              >
                <CardContent>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1 pe-3">
                      <Typography variant="h6" className="sop-title">
                        {sop.title}
                      </Typography>
                      <div className="d-flex align-items-center mt-2 mb-2">
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            fontSize: '0.8rem',
                            background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}80 100%)`
                          }}
                        >
                          {sop.author.charAt(0)}
                        </Avatar>
                        <small className="text-muted ms-2">by {sop.author}</small>
                        <span className="text-muted mx-2">•</span>
                        <small className="text-muted">{sop.lastUpdated}</small>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <Tooltip title="Edit SOP">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSOP(sop);
                          }}
                          style={{
                            background: `${category.color}15`,
                            color: category.color
                          }}
                        >
                          <HiPencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete SOP">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSOP(sop.id);
                          }}
                          style={{
                            background: '#dc354515',
                            color: '#dc3545'
                          }}
                        >
                          <HiTrash />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <Typography variant="body2" className="sop-description">
                    {sop.description}
                  </Typography>
                  
                  <div className="d-flex justify-content-between align-items-center my-3">
                    <Chip 
                      label={sop.priority}
                      size="small"
                      style={{ 
                        background: `linear-gradient(135deg, ${getPriorityColor(sop.priority)}20 0%, ${getPriorityColor(sop.priority)}30 100%)`,
                        color: getPriorityColor(sop.priority),
                        fontWeight: 600,
                        border: `1px solid ${getPriorityColor(sop.priority)}40`
                      }}
                    />
                    <div className="d-flex align-items-center gap-3">
                      <Tooltip title="Completion Rate">
                        <div className="d-flex align-items-center text-muted">
                          <HiSignal className="me-1" />
                          <small>{metrics.completionRate}%</small>
                        </div>
                      </Tooltip>
                      <Tooltip title="Views">
                        <div className="d-flex align-items-center text-muted">
                          <HiEye className="me-1" />
                          <small>{metrics.views}</small>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <div className="theme-tags">
                    {sop.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="theme-tag theme-tag-category"
                        style={{
                          '--category-color': category.color,
                          '--category-color-light': `${category.color}15`,
                          '--category-color-dark': category.color,
                          '--category-color-border': `${category.color}30`
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="mt-3 w-100"
                    onClick={() => onSOPClick(sop)}
                    style={{
                      background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}80 100%)`,
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px',
                      fontWeight: 600
                    }}
                  >
                    <HiMagnifyingGlass className="me-2" />
                    View Complete Guide
                  </Button>
                </CardContent>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Enhanced Empty State */}
      {sortedSops.length === 0 && (
        <Row>
          <Col>
            <Card className="quick-actions-card">
              <CardContent className="text-center py-5">
                <div style={{ color: category.color, fontSize: '5rem', marginBottom: '20px' }}>
                  {getIconComponent(category.icon)}
                </div>
                <Typography variant="h5" className="text-dark mb-3">
                  {filterPriority !== 'all' 
                    ? `No ${filterPriority} priority SOPs found`
                    : `No SOPs in ${category.name} yet`
                  }
                </Typography>
                <Typography variant="body1" className="text-muted mb-4">
                  {filterPriority !== 'all' 
                    ? 'Try adjusting your filter or create a new SOP with the desired priority.'
                    : 'This category is ready for your first SOP. Start building your knowledge base!'
                  }
                </Typography>
                <div className="d-flex gap-2 justify-content-center">
                  <Button 
                    variant="primary" 
                    onClick={() => setShowAddModal(true)}
                    style={{
                      background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}80 100%)`,
                      border: 'none'
                    }}
                  >
                    <HiPlus className="me-2" />
                    Add First SOP
                  </Button>
                  {filterPriority !== 'all' && (
                    <Button variant="outline-secondary" onClick={() => setFilterPriority('all')}>
                      Clear Filter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Col>
        </Row>
      )}

      {/* Enhanced Floating Add Button */}
      <Tooltip title="Quick Add SOP" placement="left">
        <Fab 
          aria-label="add"
          style={{ 
            position: 'fixed', 
            bottom: 30, 
            right: 30,
            background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}80 100%)`,
            zIndex: 1000
          }}
          onClick={() => setShowAddModal(true)}
        >
          <HiPlus />
        </Fab>
      </Tooltip>

      {/* Enhanced Add/Edit SOP Modal */}
      <Modal show={showAddModal} onHide={() => {
        setShowAddModal(false);
        setEditingSOP(null);
      }} size="lg" centered>
        <Modal.Header 
          closeButton 
          style={{ 
            background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}80 100%)`, 
            color: 'white' 
          }}
        >
          <Modal.Title>
            {editingSOP ? <HiPencil className="me-2" /> : <HiPlus className="me-2" />}
            {editingSOP ? 'Edit SOP' : `Add New ${category.name} SOP`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSOP.title}
                    onChange={(e) => setNewSOP({...newSOP, title: e.target.value})}
                    placeholder={`Enter ${category.name} SOP title`}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newSOP.priority}
                    onChange={(e) => setNewSOP({...newSOP, priority: e.target.value})}
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newSOP.description}
                onChange={(e) => setNewSOP({...newSOP, description: e.target.value})}
                placeholder="Describe what this SOP covers and when to use it"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSOP.category || category.name}
                    onChange={(e) => setNewSOP({...newSOP, category: e.target.value})}
                    placeholder="e.g., Installation, Configuration, Troubleshooting"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={newSOP.tags}
                    onChange={(e) => setNewSOP({...newSOP, tags: e.target.value})}
                    placeholder={`e.g., ${category.name.toLowerCase()}, installation, setup`}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Steps (one per line)</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                value={newSOP.steps}
                onChange={(e) => setNewSOP({...newSOP, steps: e.target.value})}
                placeholder="Enter each step on a new line. Be specific and include commands, screenshots references, or important notes."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => {
            setShowAddModal(false);
            setEditingSOP(null);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={editingSOP ? handleUpdateSOP : handleAddSOP}
            style={{
              background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}80 100%)`,
              border: 'none'
            }}
          >
            {editingSOP ? 'Update SOP' : 'Create SOP'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryView; 