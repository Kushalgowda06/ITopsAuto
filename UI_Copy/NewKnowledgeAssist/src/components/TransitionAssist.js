import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Badge, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  HiArrowsRightLeft, 
  HiPhone, 
  HiCheckCircle, 
  HiXCircle,
  HiDocumentText,
  HiPlus,
  HiMicrophone,
  HiClock,
  HiUsers,
  HiVideoCamera,
  HiChatBubbleLeft,
  HiDocumentDuplicate,
  HiExclamationTriangle,
  HiLightBulb,
  HiCog6Tooth,
  HiCalendarDays
} from 'react-icons/hi2';

const TransitionAssist = () => {
  const navigate = useNavigate();
  const [showNewSOPModal, setShowNewSOPModal] = useState(false);
  const [showSOPDetailModal, setShowSOPDetailModal] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [showLiveCallsModal, setShowLiveCallsModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showCallDetailModal, setShowCallDetailModal] = useState(false);
  const [showJoinCallModal, setShowJoinCallModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSOP, setNewSOP] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    tags: '',
    steps: ''
  });

  // Mock data for KPIs
  const kpiData = [
    {
      title: 'Total Calls',
      value: '247',
      icon: HiPhone,
      color: '#007bff',
      description: 'Total calls handled'
    },
    {
      title: 'Attended',
      value: '231',
      icon: HiCheckCircle,
      color: '#28a745',
      description: 'Successfully attended calls'
    },
    {
      title: 'Completed',
      value: '198',
      icon: HiCheckCircle,
      color: '#17a2b8',
      description: 'Completed transfers'
    },
    {
      title: 'Failed',
      value: '16',
      icon: HiXCircle,
      color: '#dc3545',
      description: 'Failed transfers'
    },
    {
      title: 'Correct SOPs',
      value: '165',
      icon: HiDocumentText,
      color: '#ffc107',
      description: 'Relevant SOPs picked'
    },
    {
      title: 'New SOPs Created',
      value: '12',
      icon: HiPlus,
      color: '#6f42c1',
      description: 'New SOPs created'
    }
  ];

  // Mock call data
  const currentCall = {
    id: 'CALL-2024-001',
    status: 'In Progress',
    duration: '00:15:32',
    participants: [
      { name: 'John Smith', role: 'Senior Engineer', avatar: 'JS' },
      { name: 'Sarah Johnson', role: 'Project Manager', avatar: 'SJ' },
      { name: 'Mike Davis', role: 'DevOps Lead', avatar: 'MD' }
    ],
    isRecording: true
  };

  // Mock chat messages
  const chatMessages = [
    {
      id: 1,
      sender: 'John Smith',
      avatar: 'JS',
      time: '10:15 AM',
      message: 'Hi everyone, we need to transition the production deployment process to the new team.',
      type: 'text'
    },
    {
      id: 2,
      sender: 'Sarah Johnson',
      avatar: 'SJ',
      time: '10:16 AM',
      message: 'Sure John, I have the documentation ready. Should we start with the CI/CD pipeline?',
      type: 'text'
    },
    {
      id: 3,
      sender: 'Mike Davis',
      avatar: 'MD',
      time: '10:17 AM',
      message: 'The current process involves these steps:\n1. Code review in GitHub\n2. Automated testing\n3. Staging deployment\n4. Production deployment after approval',
      type: 'text'
    },
    {
      id: 4,
      sender: 'John Smith',
      avatar: 'JS',
      time: '10:18 AM',
      message: 'What about the rollback procedures? We had some issues last month.',
      type: 'text'
    },
    {
      id: 5,
      sender: 'Sarah Johnson',
      avatar: 'SJ',
      time: '10:19 AM',
      message: 'Good point. The rollback process needs to be documented. Currently it\'s mostly tribal knowledge.',
      type: 'text'
    },
    {
      id: 6,
      sender: 'Mike Davis',
      avatar: 'MD',
      time: '10:20 AM',
      message: 'I can create a comprehensive SOP for the rollback procedures. It should include database backup steps.',
      type: 'text'
    }
  ];

  // Mock call summary
  const callSummary = `# Call Summary: Production Deployment Transition

## Meeting Details
- **Date:** January 15, 2024
- **Duration:** 15:32 minutes
- **Participants:** John Smith, Sarah Johnson, Mike Davis
- **Topic:** Production Deployment Process Transition

## Key Discussion Points

### Current Process Overview
- Code review process in GitHub
- Automated testing pipeline
- Staging environment deployment
- Production deployment with approval workflow

### Issues Identified
- Rollback procedures not properly documented
- Tribal knowledge dependency
- Database backup steps missing from rollback process

### Action Items
1. **Mike Davis** - Create comprehensive rollback SOP
2. **Sarah Johnson** - Document approval workflow
3. **John Smith** - Review and validate new processes

### Technical Requirements
- Database backup integration
- Automated rollback triggers
- Monitoring and alerting setup

## Next Steps
- Schedule follow-up meeting for next week
- Create detailed SOPs for identified gaps
- Test rollback procedures in staging environment`;

  // Mock matching SOPs
  const matchingSOPs = [
    {
      id: 'SOP-001',
      title: 'Production Deployment Guidelines',
      category: 'DevOps',
      matchPercentage: 85,
      successRate: 92,
      failureRate: 8,
      description: 'Standard procedures for production deployments',
      lastUpdated: '2024-01-10',
      steps: `# Production Deployment Guidelines

## Prerequisites
- [ ] Code review completed and approved
- [ ] All tests passing in staging environment
- [ ] Database migration scripts validated
- [ ] Backup plan confirmed

## Deployment Steps
1. **Pre-deployment checklist**
   - Verify staging environment is stable
   - Confirm all dependencies are available
   - Check system resources and capacity

2. **Database Migration**
   - Create database backup
   - Run migration scripts in staging
   - Validate data integrity

3. **Application Deployment**
   - Deploy to blue-green environment
   - Perform smoke tests
   - Update load balancer configuration

4. **Post-deployment verification**
   - Monitor application logs
   - Check system metrics
   - Verify user functionality

## Rollback Procedure
1. Switch traffic back to previous version
2. Restore database backup if needed
3. Investigate and document issues`
    },
    {
      id: 'SOP-002',
      title: 'CI/CD Pipeline Management',
      category: 'Development',
      matchPercentage: 78,
      successRate: 88,
      failureRate: 12,
      description: 'Continuous integration and deployment best practices',
      lastUpdated: '2024-01-08',
      steps: `# CI/CD Pipeline Management

## Pipeline Configuration
- [ ] Source control integration
- [ ] Automated testing setup
- [ ] Build artifact management
- [ ] Deployment automation

## Build Process
1. **Code Integration**
   - Pull latest changes from main branch
   - Run static code analysis
   - Execute unit tests

2. **Build and Package**
   - Compile application
   - Create deployment artifacts
   - Generate documentation

3. **Testing Stages**
   - Unit tests
   - Integration tests
   - Performance tests
   - Security scans

4. **Deployment Pipeline**
   - Deploy to staging
   - Run acceptance tests
   - Deploy to production (manual approval)

## Monitoring and Alerts
- Build failure notifications
- Test coverage reports
- Deployment status updates`
    },
    {
      id: 'SOP-003',
      title: 'Code Review Process',
      category: 'Development',
      matchPercentage: 72,
      successRate: 95,
      failureRate: 5,
      description: 'Guidelines for effective code reviews',
      lastUpdated: '2024-01-05',
      steps: `# Code Review Process

## Review Requirements
- [ ] All code changes must be reviewed
- [ ] Minimum 2 reviewers for critical changes
- [ ] Senior developer approval required
- [ ] All comments must be addressed

## Review Checklist
1. **Code Quality**
   - Check for code clarity and readability
   - Verify proper naming conventions
   - Ensure appropriate comments

2. **Functionality**
   - Verify requirements are met
   - Check edge cases handling
   - Validate error handling

3. **Security**
   - Check for security vulnerabilities
   - Verify input validation
   - Review authentication/authorization

4. **Performance**
   - Identify potential bottlenecks
   - Check database query efficiency
   - Verify caching strategies

## Approval Process
- All reviewers must approve
- Author resolves all comments
- Final approval from tech lead`
    },
    {
      id: 'SOP-004',
      title: 'Staging Environment Setup',
      category: 'Infrastructure',
      matchPercentage: 65,
      successRate: 84,
      failureRate: 16,
      description: 'Setting up and maintaining staging environments',
      lastUpdated: '2024-01-03',
      steps: `# Staging Environment Setup

## Environment Requirements
- [ ] Mirror production configuration
- [ ] Isolated network setup
- [ ] Test data management
- [ ] Monitoring and logging

## Setup Process
1. **Infrastructure Provisioning**
   - Provision virtual machines
   - Configure networking
   - Set up load balancers

2. **Application Deployment**
   - Deploy application stack
   - Configure databases
   - Set up monitoring tools

3. **Data Management**
   - Create test datasets
   - Anonymize sensitive data
   - Set up data refresh procedures

4. **Access Control**
   - Configure user access
   - Set up VPN connections
   - Implement security policies

## Maintenance
- Regular environment updates
- Performance monitoring
- Issue troubleshooting
- Documentation updates`
    }
  ];

  // Mock live calls data
  const liveCalls = [
    {
      id: 'CALL-2024-001',
      title: 'Production Deployment Transition',
      status: 'In Progress',
      duration: '00:15:32',
      participants: [
        { name: 'John Smith', role: 'Senior Engineer', avatar: 'JS' },
        { name: 'Sarah Johnson', role: 'Project Manager', avatar: 'SJ' },
        { name: 'Mike Davis', role: 'DevOps Lead', avatar: 'MD' }
      ],
      isRecording: true,
      priority: 'High',
      category: 'DevOps'
    },
    {
      id: 'CALL-2024-002',
      title: 'Security Incident Response',
      status: 'In Progress',
      duration: '00:08:45',
      participants: [
        { name: 'Alex Wilson', role: 'Security Lead', avatar: 'AW' },
        { name: 'Lisa Chen', role: 'System Admin', avatar: 'LC' }
      ],
      isRecording: true,
      priority: 'Critical',
      category: 'Security'
    },
    {
      id: 'CALL-2024-003',
      title: 'Database Migration Planning',
      status: 'Waiting',
      duration: '00:00:00',
      participants: [
        { name: 'Tom Brown', role: 'Database Admin', avatar: 'TB' },
        { name: 'Emma White', role: 'Backend Developer', avatar: 'EW' },
        { name: 'Chris Green', role: 'DevOps Engineer', avatar: 'CG' }
      ],
      isRecording: false,
      priority: 'Medium',
      category: 'Database'
    },
    {
      id: 'CALL-2024-004',
      title: 'Network Infrastructure Review',
      status: 'In Progress',
      duration: '00:22:15',
      participants: [
        { name: 'David Lee', role: 'Network Engineer', avatar: 'DL' },
        { name: 'Jennifer Kim', role: 'Infrastructure Lead', avatar: 'JK' }
      ],
      isRecording: true,
      priority: 'Low',
      category: 'Infrastructure'
    }
  ];

  const handleCreateNewSOP = () => {
    setNewSOP({
      title: 'Production Rollback Procedures',
      description: 'Comprehensive procedures for rolling back production deployments including database backup steps',
      category: 'DevOps',
      priority: 'High',
      tags: 'rollback, production, database, deployment',
      steps: '1. Stop incoming traffic\n2. Create database backup\n3. Rollback application code\n4. Verify database consistency\n5. Restore traffic\n6. Monitor for issues'
    });
    setIsEditMode(false);
    setShowNewSOPModal(true);
  };

  const handleEditSuggestedSOP = () => {
    setNewSOP({
      title: 'Production Rollback Procedures',
      description: 'Comprehensive procedures for rolling back production deployments including database backup steps',
      category: 'DevOps',
      priority: 'High',
      tags: 'rollback, production, database, deployment',
      steps: '1. Stop incoming traffic\n2. Create database backup\n3. Rollback application code\n4. Verify database consistency\n5. Restore traffic\n6. Monitor for issues'
    });
    setIsEditMode(true);
    setShowNewSOPModal(true);
  };

  const handleSaveNewSOP = () => {
    console.log(isEditMode ? 'Editing SOP:' : 'Creating new SOP:', newSOP);
    setShowNewSOPModal(false);
    setIsEditMode(false);
    setNewSOP({ title: '', description: '', category: '', priority: 'Medium', tags: '', steps: '' });
  };

  const handleViewSOP = (sop) => {
    setSelectedSOP(sop);
    setShowSOPDetailModal(true);
  };

  const handleShowLiveCalls = () => {
    setShowLiveCallsModal(true);
  };

  const handleViewCallDetail = (call) => {
    setSelectedCall(call);
    setShowCallDetailModal(true);
    setShowLiveCallsModal(false);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 75) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  return (
    <Container fluid className="theme-fade-in" style={{ padding: '1rem 1.5rem' }}>
      {/* Header */}
      <div className="theme-page-header theme-text-center theme-mb-lg py-2">
        <h1 className="theme-page-title text-center d-flex align-items-center justify-content-center" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          <HiArrowsRightLeft style={{ color: 'var(--primary-color)', marginRight: '0.5rem', fontSize: '1.6rem' }} />
          Transition Assist Dashboard
        </h1>
        <p className="theme-page-subtitle text-center" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
          Streamline knowledge transfer with intelligent call analysis and SOP matching
        </p>
      </div>

      {/* KPI Cards - All in single row */}
      <Row className="theme-mb-lg" style={{ margin: '0 -5px' }}>
        {kpiData.map((kpi, index) => (
          <Col className="mb-3 px-1" key={index} style={{ 
            flex: '1 1 calc(14.28% - 10px)', 
            maxWidth: 'calc(15.28% - 10px)',
            padding: '0 5px'
          }}>
            <div className="theme-kpi-card compact" style={{ 
              background: `linear-gradient(135deg, ${kpi.color}15, ${kpi.color}25)`,
              border: `1px solid ${kpi.color}30`,
              animationDelay: `${index * 0.1}s`,
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div className="theme-kpi-icon" style={{ 
                fontSize: '1.2rem', 
                marginBottom: '0.3rem',
                color: kpi.color 
              }}>
                <kpi.icon />
              </div>
              <div className="theme-kpi-value" style={{ 
                fontSize: '1.2rem', 
                marginBottom: '0.2rem',
                color: kpi.color,
                fontWeight: 'bold'
              }}>
                {kpi.value}
              </div>
              <div className="theme-kpi-label" style={{ 
                fontSize: '0.7rem', 
                marginBottom: '0.3rem',
                fontWeight: '600'
              }}>
                {kpi.title}
              </div>
              <p className="text-center mt-1 text-muted small" style={{ 
                fontSize: '0.6rem', 
                marginBottom: '0',
                lineHeight: '1.1'
              }}>
                {kpi.description}
              </p>
            </div>
          </Col>
        ))}
        
        {/* Live Calls Card */}
        <Col className="mb-3" style={{ 
          flex: '1 1 calc(14.28% - 10px)', 
          maxWidth: 'calc(14.28% - 10px)',
          padding: '0 5px'
        }}>
          <div 
            className="theme-kpi-card compact" 
            onClick={handleShowLiveCalls}
            style={{ 
              background: 'linear-gradient(135deg, #17a2b815, #17a2b825)',
              border: '1px solid #17a2b830',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              animationDelay: `${kpiData.length * 0.1}s`,
              height: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div className="theme-kpi-icon" style={{ 
              fontSize: '1.2rem', 
              marginBottom: '0.3rem',
              color: '#17a2b8' 
            }}>
              <HiPhone />
            </div>
            <div className="theme-kpi-value" style={{ 
              fontSize: '1.2rem', 
              marginBottom: '0.2rem',
              color: '#17a2b8',
              fontWeight: 'bold'
            }}>
              {liveCalls.filter(call => call.status === 'In Progress').length}
            </div>
            <div className="theme-kpi-label" style={{ 
              fontSize: '0.7rem', 
              marginBottom: '0.3rem',
              fontWeight: '600'
            }}>
              Live Calls
            </div>
            <p className="text-center mt-1 text-muted small" style={{ 
              fontSize: '0.6rem', 
              marginBottom: '0',
              lineHeight: '1.1'
            }}>
              Click to view ongoing calls
            </p>
          </div>
        </Col>
      </Row>

      {/* Main Content - Teams Chat (70%) and Call Summary (30%) */}
      <Row className="theme-mb-lg">
        {/* Teams Chat Interface - 70% */}
        <Col lg={8} className="mb-3">
          <div className="theme-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            {/* Call Status Header */}
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
              <div className="d-flex justify-content-between align-items-center w-100">
                <div>
                  <h5 className="theme-card-title" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                    <HiVideoCamera style={{ marginRight: '0.5rem', color: '#007bff' }} />
                    Call: {currentCall.id}
                  </h5>
                  <div className="d-flex align-items-center gap-3">
                    <Badge bg={currentCall.status === 'In Progress' ? 'success' : 'secondary'}>
                      {currentCall.status}
                    </Badge>
                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      <HiClock style={{ fontSize: '0.9rem' }} />
                      {currentCall.duration}
                    </div>
                    {currentCall.isRecording && (
                      <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', color: '#dc3545' }}>
                        <HiMicrophone style={{ fontSize: '0.9rem', color: '#dc3545' }} />
                        Recording
                        <div style={{ 
                          width: '8px', 
                          height: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: '#dc3545',
                          animation: 'pulse 1.5s infinite'
                        }}></div>
                      </div>
                    )}
                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      <HiUsers style={{ fontSize: '0.9rem' }} />
                      {currentCall.participants.length}
                    </div>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowJoinCallModal(true)}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      fontSize: '0.8rem'
                    }}
                  >
                    <HiVideoCamera style={{ marginRight: '0.3rem' }} />
                    Join Call
                  </Button>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #e9ecef', background: '#f8f9fa', flexShrink: 0 }}>
              <div className="d-flex gap-2">
                {currentCall.participants.map((participant, index) => (
                  <div key={index} className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      {participant.avatar}
                    </div>
                    <span style={{ fontWeight: '500' }}>{participant.name}</span>
                    <span style={{ color: '#6c757d', fontSize: '0.75rem' }}>({participant.role})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div style={{ 
              flex: 1, 
              overflow: 'auto', 
              padding: '1rem',
              background: '#f8f9fa'
            }}>
              <div className="chat-messages">
                {chatMessages.map((message) => (
                  <div key={message.id} className="message-item" style={{ 
                    marginBottom: '1rem',
                    display: 'flex',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {message.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{message.sender}</span>
                        <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>{message.time}</span>
                      </div>
                      <div style={{ 
                        background: 'white',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                        whiteSpace: 'pre-line'
                      }}>
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* Call Summary - 30% */}
        <Col lg={4} className="mb-3">
          <div className="theme-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem 0.25rem', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1rem', marginBottom: '0' }}>
                <HiChatBubbleLeft style={{ marginRight: '0.5rem', color: '#28a745' }} />
                Call Summary
              </h5>
              <p className="text-muted mt-1" style={{ fontSize: '0.8rem', marginBottom: '0' }}>
                AI-generated meeting summary
              </p>
            </div>
            <div className="theme-card-body" style={{ 
              padding: '0.75rem 1rem', 
              flex: 1, 
              overflow: 'auto',
              maxHeight: 'calc(600px - 80px)'
            }}>
              <div style={{ 
                fontSize: '0.8rem', 
                lineHeight: '1.4',
                fontFamily: 'monospace',
                whiteSpace: 'pre-line',
                color: '#333'
              }}>
                {callSummary}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Bottom Section - SOP Matching and New SOP Creation */}
      <Row className="theme-mb-lg">
        {/* Matching SOPs - Left */}
        <Col lg={8} className="mb-3">
          <div className="theme-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem 0.25rem', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                <HiDocumentDuplicate style={{ marginRight: '0.5rem', color: '#ffc107' }} />
                Matching SOPs Analysis
              </h5>
              <p className="text-muted mt-1" style={{ fontSize: '0.85rem', marginBottom: '0' }}>
                SOPs matching with call summary and their success rates
              </p>
            </div>
            <div className="theme-card-body" style={{ 
              padding: '1rem', 
              flex: 1, 
              overflow: 'auto',
              maxHeight: 'calc(500px - 80px)'
            }}>
              {matchingSOPs.map((sop, index) => (
                <div key={sop.id} className="sop-item" style={{ 
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: `2px solid ${getMatchColor(sop.matchPercentage)}20`,
                  transition: 'all 0.3s ease'
                }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ flex: 1 }}>
                      <h6 style={{ 
                        fontSize: '0.95rem', 
                        fontWeight: '600', 
                        marginBottom: '0.25rem',
                        color: '#333'
                      }}>
                        {sop.title}
                      </h6>
                      <p style={{ 
                        fontSize: '0.8rem', 
                        color: '#666',
                        marginBottom: '0.5rem',
                        lineHeight: '1.3'
                      }}>
                        {sop.description}
                      </p>
                      <div className="d-flex gap-2 mb-2">
                        <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>
                          {sop.category}
                        </Badge>
                        <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                          Updated: {sop.lastUpdated}
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold',
                        color: getMatchColor(sop.matchPercentage),
                        marginBottom: '0.25rem'
                      }}>
                        {sop.matchPercentage}%
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                        Match Rate
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-1">
                        <HiCheckCircle style={{ color: '#28a745', fontSize: '0.9rem' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#28a745' }}>
                          {sop.successRate}% Success
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <HiXCircle style={{ color: '#dc3545', fontSize: '0.9rem' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#dc3545' }}>
                          {sop.failureRate}% Failure
                        </span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline-primary"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleViewSOP(sop)}
                    >
                      View SOP
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Create New SOP - Right */}
        <Col lg={4} className="mb-3">
          <div className="theme-card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem 0.25rem', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1rem', marginBottom: '0' }}>
                <HiExclamationTriangle style={{ marginRight: '0.5rem', color: '#ffc107' }} />
                SOP Gap Identified
              </h5>
              <p className="text-muted mt-1" style={{ fontSize: '0.8rem', marginBottom: '0' }}>
                No SOP matches above 90%
              </p>
            </div>
            <div className="theme-card-body" style={{ 
              padding: '1rem', 
              flex: 1, 
              overflow: 'auto',
              maxHeight: 'calc(500px - 80px)'
            }}>
              <div className="alert alert-warning" style={{ 
                padding: '0.75rem',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                borderRadius: '6px'
              }}>
                <HiLightBulb style={{ marginRight: '0.5rem' }} />
                A new SOP is recommended for "Production Rollback Procedures"
              </div>

              <div className="suggested-sop" style={{ 
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '2px dashed #dee2e6',
                transition: 'all 0.3s ease'
              }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0' }}>
                    Suggested New SOP
                  </h6>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    color: '#667eea',
                    background: '#667eea20',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}>
                    AI Generated
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.75rem' }}>
                  <strong>Title:</strong> Production Rollback Procedures<br/>
                  <strong>Category:</strong> DevOps<br/>
                  <strong>Priority:</strong> High<br/>
                  <strong>Based on:</strong> Call analysis and identified gaps
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#333',
                  background: 'white',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  lineHeight: '1.4',
                  border: '1px solid #e9ecef'
                }}>
                  Key topics: Database backup, rollback triggers, monitoring procedures
                </div>
                <div className="mt-2" style={{ 
                  fontSize: '0.7rem', 
                  color: '#667eea',
                  fontStyle: 'italic'
                }}>
                  💡 Click "Edit SOP" to customize the content before creating
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={handleEditSuggestedSOP}
                  style={{ 
                    flex: 1,
                    fontSize: '0.8rem',
                    borderColor: '#667eea',
                    color: '#667eea'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#667eea';
                    e.target.style.borderColor = '#667eea';
                  }}
                >
                  <HiCog6Tooth style={{ marginRight: '0.4rem' }} />
                  Edit SOP
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleCreateNewSOP}
                  style={{ 
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontSize: '0.8rem'
                  }}
                >
                  <HiPlus style={{ marginRight: '0.4rem' }} />
                  Create SOP
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* New SOP Modal */}
      <Modal show={showNewSOPModal} onHide={() => setShowNewSOPModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            {isEditMode ? (
              <>
                <HiCog6Tooth className="me-2" /> Edit Suggested SOP
              </>
            ) : (
              <>
                <HiPlus className="me-2" /> Create New SOP
              </>
            )}
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
                    <option value="DevOps">DevOps</option>
                    <option value="Development">Development</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Security">Security</option>
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
          <Button variant="secondary" onClick={() => {
            setShowNewSOPModal(false);
            setIsEditMode(false);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveNewSOP}
            style={{ background: 'var(--bg-gradient)', border: 'none' }}
          >
            {isEditMode ? (
              <>
                <HiCog6Tooth className="me-2" /> Update SOP
              </>
            ) : (
              <>
                <HiPlus className="me-2" /> Create SOP
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SOP Detail Modal */}
      <Modal show={showSOPDetailModal} onHide={() => setShowSOPDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiDocumentText className="me-2" /> 
            {selectedSOP?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflow: 'auto' }}>
          {selectedSOP && (
            <div>
              <div className="d-flex gap-3 mb-3">
                <Badge bg="light" text="dark">{selectedSOP.category}</Badge>
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  Last Updated: {selectedSOP.lastUpdated}
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold',
                  color: getMatchColor(selectedSOP.matchPercentage)
                }}>
                  {selectedSOP.matchPercentage}% Match
                </span>
              </div>
              <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', color: '#666' }}>
                {selectedSOP.description}
              </p>
              <div style={{ 
                fontSize: '0.9rem', 
                lineHeight: '1.6',
                fontFamily: 'monospace',
                whiteSpace: 'pre-line',
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                {selectedSOP.steps}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSOPDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Live Calls Modal */}
      <Modal show={showLiveCallsModal} onHide={() => setShowLiveCallsModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiPhone className="me-2" /> Live Calls
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <div className="calls-list">
            {liveCalls.map((call) => (
              <div 
                key={call.id} 
                className="call-item" 
                onClick={() => handleViewCallDetail(call)}
                style={{ 
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div style={{ flex: 1 }}>
                    <h6 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      marginBottom: '0.25rem',
                      color: '#333'
                    }}>
                      {call.title}
                    </h6>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <Badge bg={call.status === 'In Progress' ? 'success' : 'secondary'}>
                        {call.status}
                      </Badge>
                      <Badge bg="light" text="dark" style={{ fontSize: '0.75rem' }}>
                        {call.category}
                      </Badge>
                      <span 
                        className="badge"
                        style={{
                          background: getPriorityColor(call.priority),
                          color: 'white',
                          fontSize: '0.7rem'
                        }}
                      >
                        {call.priority}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                      <div className="d-flex align-items-center gap-1">
                        <HiClock style={{ fontSize: '0.9rem' }} />
                        {call.duration}
                      </div>
                      {call.isRecording && (
                        <div className="d-flex align-items-center gap-1" style={{ color: '#dc3545' }}>
                          <HiMicrophone style={{ fontSize: '0.9rem' }} />
                          Recording
                        </div>
                      )}
                      <div className="d-flex align-items-center gap-1">
                        <HiUsers style={{ fontSize: '0.9rem' }} />
                        {call.participants.length} participants
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-1 flex-wrap">
                  {call.participants.map((participant, index) => (
                    <div key={index} className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 'bold'
                      }}>
                        {participant.avatar}
                      </div>
                      <span>{participant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLiveCallsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Call Detail Modal */}
      <Modal show={showCallDetailModal} onHide={() => setShowCallDetailModal(false)} size="xl" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiVideoCamera className="me-2" /> 
            {selectedCall?.title} - {selectedCall?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflow: 'hidden', padding: 0 }}>
          {selectedCall && (
            <div style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              {/* Call Info Header */}
              <div style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', background: '#f8f9fa' }}>
                <div className="d-flex align-items-center gap-3 mb-2">
                  <Badge bg={selectedCall.status === 'In Progress' ? 'success' : 'secondary'}>
                    {selectedCall.status}
                  </Badge>
                  <Badge bg="light" text="dark">{selectedCall.category}</Badge>
                  <span 
                    className="badge"
                    style={{
                      background: getPriorityColor(selectedCall.priority),
                      color: 'white',
                      fontSize: '0.8rem'
                    }}
                  >
                    {selectedCall.priority}
                  </span>
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                    <HiClock />
                    {selectedCall.duration}
                  </div>
                  {selectedCall.isRecording && (
                    <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.9rem', color: '#dc3545' }}>
                      <HiMicrophone />
                      Recording
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#dc3545',
                        animation: 'pulse 1.5s infinite'
                      }}></div>
                    </div>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {selectedCall.participants.map((participant, index) => (
                    <div key={index} className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>
                        {participant.avatar}
                      </div>
                      <span>{participant.name} ({participant.role})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ 
                flex: 1, 
                overflow: 'auto', 
                padding: '1rem',
                background: '#f8f9fa'
              }}>
                <div className="chat-messages">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="message-item" style={{ 
                      marginBottom: '1rem',
                      display: 'flex',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {message.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{message.sender}</span>
                          <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>{message.time}</span>
                        </div>
                        <div style={{ 
                          background: 'white',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef',
                          fontSize: '0.85rem',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-line'
                        }}>
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCallDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Join Call Modal */}
      <Modal show={showJoinCallModal} onHide={() => setShowJoinCallModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiVideoCamera className="me-2" /> Join Microsoft Teams Meeting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="meeting-details">
            {/* Meeting Link Section */}
            <div className="mb-4">
              <h6 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#333' }}>
                <HiLightBulb style={{ marginRight: '0.3rem', color: '#007bff' }} />
                Join via Teams App or Browser
              </h6>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Teams Meeting Link</Form.Label>
                  <Form.Control
                    type="text"
                    value="https://teams.microsoft.com/l/meetup-join/19%3ameeting_NjY4ZTM5NzAtODYwMS00ZTI0LWFjOTgtZmE1Y2Y5MjM2YjI4%40thread.v2/0?context=%7b%22Tid%22%3a%22abc123%22%2c%22Oid%22%3a%22def456%22%7d"
                    readOnly
                    style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                  />
                  <Form.Text className="text-muted">
                    Click the link or copy and paste it into your browser
                  </Form.Text>
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    size="sm"
                    style={{ 
                      background: '#5b5fc7',
                      border: 'none',
                      fontSize: '0.8rem'
                    }}
                    onClick={() => window.open('https://teams.microsoft.com/l/meetup-join/19%3ameeting_NjY4ZTM5NzAtODYwMS00ZTI0LWFjOTgtZmE1Y2Y5MjM2YjI4%40thread.v2/0?context=%7b%22Tid%22%3a%22abc123%22%2c%22Oid%22%3a%22def456%22%7d', '_blank')}
                  >
                    <HiVideoCamera style={{ marginRight: '0.3rem' }} />
                    Open Teams
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => {
                      navigator.clipboard.writeText('https://teams.microsoft.com/l/meetup-join/19%3ameeting_NjY4ZTM5NzAtODYwMS00ZTI0LWFjOTgtZmE1Y2Y5MjM2YjI4%40thread.v2/0?context=%7b%22Tid%22%3a%22abc123%22%2c%22Oid%22%3a%22def456%22%7d');
                    }}
                  >
                    <HiDocumentDuplicate style={{ marginRight: '0.3rem' }} />
                    Copy Link
                  </Button>
                </div>
              </div>
            </div>

            {/* Phone Dial-in Section */}
            <div className="mb-4">
              <h6 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#333' }}>
                <HiPhone style={{ marginRight: '0.3rem', color: '#28a745' }} />
                Join by Phone
              </h6>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Phone Number (US)</Form.Label>
                      <Form.Control
                        type="text"
                        value="+1 323-849-4874"
                        readOnly
                        style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Conference ID</Form.Label>
                      <Form.Control
                        type="text"
                        value="867 542 391#"
                        readOnly
                        style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Alternative Number</Form.Label>
                      <Form.Control
                        type="text"
                        value="+1 669-444-9171"
                        readOnly
                        style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Meeting Passcode</Form.Label>
                      <Form.Control
                        type="text"
                        value="542391"
                        readOnly
                        style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="alert alert-info" style={{ 
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  marginBottom: '0',
                  backgroundColor: '#d1ecf1',
                  border: '1px solid #bee5eb'
                }}>
                  <strong>Dial-in Instructions:</strong><br/>
                  1. Dial the phone number above<br/>
                  2. When prompted, enter the Conference ID<br/>
                  3. Enter the passcode if requested<br/>
                  4. Press # to join the meeting
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-4">
              <h6 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#333' }}>
                <HiCog6Tooth style={{ marginRight: '0.3rem', color: '#6c757d' }} />
                Additional Options
              </h6>
              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Meeting ID</Form.Label>
                      <Form.Control
                        type="text"
                        value="867 542 391"
                        readOnly
                        style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Session ID</Form.Label>
                      <Form.Control
                        type="text"
                        value="4e7f8a9b-1c2d-3e4f-5a6b-7c8d9e0f1a2b"
                        readOnly
                        style={{ fontSize: '0.85rem', backgroundColor: '#fff' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <HiCalendarDays style={{ marginRight: '0.3rem' }} />
                    Add to Calendar
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <HiDocumentText style={{ marginRight: '0.3rem' }} />
                    Meeting Details
                  </Button>
                  <Button 
                    variant="outline-info" 
                    size="sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <HiUsers style={{ marginRight: '0.3rem' }} />
                    Participant List
                  </Button>
                </div>
              </div>
            </div>

            {/* Meeting Information */}
            <div className="meeting-info" style={{ 
              background: '#e8f4fd', 
              padding: '1rem', 
              borderRadius: '8px',
              border: '1px solid #cce7f0'
            }}>
              <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#004085' }}>
                Meeting Information
              </h6>
              <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: '#004085' }}>
                <strong>Title:</strong> {currentCall.id} - Production Deployment Transition<br/>
                <strong>Organizer:</strong> Sarah Johnson (sarah.johnson@company.com)<br/>
                <strong>Start Time:</strong> January 15, 2024 10:15 AM (PST)<br/>
                <strong>Duration:</strong> 30 minutes (scheduled)<br/>
                <strong>Meeting Type:</strong> Transition Knowledge Transfer<br/>
                <strong>Recording:</strong> Enabled (Auto-recorded for compliance)
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowJoinCallModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary"
            onClick={() => {
              window.open('https://teams.microsoft.com/l/meetup-join/19%3ameeting_NjY4ZTM5NzAtODYwMS00ZTI0LWFjOTgtZmE1Y2Y5MjM2YjI4%40thread.v2/0?context=%7b%22Tid%22%3a%22abc123%22%2c%22Oid%22%3a%22def456%22%7d', '_blank');
              setShowJoinCallModal(false);
            }}
            style={{ 
              background: '#5b5fc7',
              border: 'none'
            }}
          >
            <HiVideoCamera className="me-2" />
            Join Now
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .theme-fade-in {
          animation: fadeIn 0.6s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .theme-kpi-card {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sop-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .chat-messages {
          height: 100%;
        }

        .message-item:hover {
          background: rgba(0,0,0,0.02);
          border-radius: 8px;
          padding: 0.25rem;
          margin: -0.25rem;
          margin-bottom: 0.75rem;
        }

        /* Custom scrollbar */
        .theme-card-body::-webkit-scrollbar {
          width: 6px;
        }

        .theme-card-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .theme-card-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .theme-card-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </Container>
  );
};

export default TransitionAssist; 