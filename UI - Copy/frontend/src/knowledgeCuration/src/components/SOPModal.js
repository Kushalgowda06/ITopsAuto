import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Tab, Tabs } from 'react-bootstrap';
import { Typography, Chip, IconButton, Paper } from '@mui/material';
import { 
  HiPencil, 
  HiTrash, 
  HiCheck, 
  HiXMark, 
  HiPrinter, 
  HiShare, 
  HiBookmark,
  HiDocumentText,
  HiInformationCircle,
  HiListBullet,
  HiClock
} from 'react-icons/hi2';

const SOPModal = ({ isOpen, onClose, sop, onUpdate, onDelete, categoryId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSOP, setEditedSOP] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (sop) {
      setEditedSOP({
        ...sop,
        tags: sop.tags ? sop.tags.join(', ') : '',
        steps: sop.steps ? sop.steps.join('\n') : ''
      });
    }
  }, [sop]);

  if (!sop) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab('edit');
  };

  const handleSave = () => {
    const updatedSOP = {
      ...editedSOP,
      tags: editedSOP.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      steps: editedSOP.steps.split('\n').filter(step => step.trim()),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    onUpdate(updatedSOP, categoryId);
    setIsEditing(false);
    setActiveTab('details');
  };

  const handleCancel = () => {
    setEditedSOP({
      ...sop,
      tags: sop.tags.join(', '),
      steps: sop.steps.join('\n')
    });
    setIsEditing(false);
    setActiveTab('details');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this SOP? This action cannot be undone.')) {
      onDelete(sop.id, categoryId);
      onClose();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${sop.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; }
            .step { margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-left: 4px solid #667eea; }
            .step-number { font-weight: bold; color: #667eea; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${sop.title}</h1>
            <p><strong>Description:</strong> ${sop.description}</p>
            <p><strong>Category:</strong> ${sop.category} | <strong>Priority:</strong> ${sop.priority}</p>
            <p><strong>Author:</strong> ${sop.author} | <strong>Last Updated:</strong> ${sop.lastUpdated}</p>
          </div>
          <h2>Steps:</h2>
          ${sop.steps.map((step, index) => `
            <div class="step">
              <span class="step-number">Step ${index + 1}:</span> ${step}
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sop.title,
        text: sop.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${sop.title}\n\n${sop.description}\n\nSteps:\n${sop.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`);
      alert('SOP content copied to clipboard!');
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

  return (
    <Modal show={isOpen} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Modal.Title className="d-flex align-items-center">
          <HiDocumentText className="me-2" />
          {sop.title}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-0">
        <Tabs 
          activeKey={activeTab} 
          onSelect={(tab) => setActiveTab(tab)}
          className="border-bottom"
        >
          <Tab eventKey="details" title={
            <span><HiInformationCircle className="me-2" />Details</span>
          }>
            <div className="p-4">
              {/* SOP Header Info */}
              <Paper elevation={1} className="p-3 mb-4">
                <Row>
                  <Col md={8}>
                    <Typography variant="h5" className="mb-2">{sop.title}</Typography>
                    <Typography variant="body1" className="text-muted mb-3">{sop.description}</Typography>
                    
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <Chip 
                        label={sop.priority}
                        style={{ 
                          backgroundColor: getPriorityColor(sop.priority) + '20',
                          color: getPriorityColor(sop.priority),
                          fontWeight: 600
                        }}
                      />
                      <span className="text-muted">Category: {sop.category}</span>
                    </div>
                    
                    <div className="theme-tags">
                      {sop.tags && sop.tags.map((tag, index) => (
                        <span key={index} className="theme-tag theme-tag-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Col>
                  
                  <Col md={4} className="text-end">
                    <div className="mb-3">
                      <IconButton onClick={handleEdit} color="primary" title="Edit">
                        <HiPencil />
                      </IconButton>
                      <IconButton onClick={handlePrint} color="default" title="Print">
                        <HiPrinter />
                      </IconButton>
                      <IconButton onClick={handleShare} color="default" title="Share">
                        <HiShare />
                      </IconButton>
                      <IconButton color="default" title="Bookmark">
                        <HiBookmark />
                      </IconButton>
                      <IconButton onClick={handleDelete} color="error" title="Delete">
                        <HiTrash />
                      </IconButton>
                    </div>
                    
                    <div className="text-muted small">
                      <div><strong>Author:</strong> {sop.author}</div>
                      <div><strong>Last Updated:</strong> {sop.lastUpdated}</div>
                      <div><strong>Views:</strong> {Math.floor(Math.random() * 1000) + 50}</div>
                    </div>
                  </Col>
                </Row>
              </Paper>

              {/* Steps */}
              <div>
                <Typography variant="h6" className="mb-3">
                  
                </Typography>
                <div className="sop-steps">
                  {sop.steps && sop.steps.map((step, index) => (
                    <div key={index} className="sop-step">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <Paper elevation={1} className="p-3 mt-4">
                <Typography variant="h6" className="mb-3">Additional Information</Typography>
                <Row>
                  <Col md={6}>
                    <div className="mb-2"><strong>Estimated Time:</strong> {Math.floor(Math.random() * 60) + 15} minutes</div>
                    <div className="mb-2"><strong>Difficulty:</strong> {['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)]}</div>
                    <div className="mb-2"><strong>Prerequisites:</strong> Basic system knowledge</div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2"><strong>Related SOPs:</strong> 3 documents</div>
                    <div className="mb-2"><strong>Success Rate:</strong> {Math.floor(Math.random() * 20) + 80}%</div>
                    <div className="mb-2"><strong>Last Tested:</strong> {new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                  </Col>
                </Row>
              </Paper>
            </div>
          </Tab>
          
          <Tab eventKey="edit" title={
            <span><HiPencil className="me-2" />Edit</span>
          }>
            <div className="p-4">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedSOP.title || ''}
                    onChange={(e) => setEditedSOP({...editedSOP, title: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editedSOP.description || ''}
                    onChange={(e) => setEditedSOP({...editedSOP, description: e.target.value})}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        value={editedSOP.category || ''}
                        onChange={(e) => setEditedSOP({...editedSOP, category: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        value={editedSOP.priority || 'Medium'}
                        onChange={(e) => setEditedSOP({...editedSOP, priority: e.target.value})}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedSOP.tags || ''}
                    onChange={(e) => setEditedSOP({...editedSOP, tags: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Steps (one per line)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    value={editedSOP.steps || ''}
                    onChange={(e) => setEditedSOP({...editedSOP, steps: e.target.value})}
                  />
                </Form.Group>
              </Form>
            </div>
          </Tab>
          
          <Tab eventKey="history" title={
            <span><HiClock className="me-2" />History</span>
          }>
            <div className="p-4">
              <Typography variant="h6" className="mb-3">Revision History</Typography>
              <div className="timeline">
                {[
                  { date: sop.lastUpdated, action: 'Last updated', author: sop.author },
                  { date: '2023-11-15', action: 'Steps modified', author: 'Jane Smith' },
                  { date: '2023-10-28', action: 'Created', author: sop.author }
                ].map((entry, index) => (
                  <div key={index} className="timeline-item mb-3 p-3 border-start border-3 border-primary bg-light">
                    <div className="fw-bold">{entry.action}</div>
                    <div className="text-muted small">
                      {entry.date} by {entry.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      
      {isEditing && (
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCancel}>
            <HiXMark className="me-2" />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            <HiCheck className="me-2" />
            Save Changes
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default SOPModal; 