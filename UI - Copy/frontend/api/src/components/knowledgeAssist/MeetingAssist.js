import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Form, Badge, Card, Table, InputGroup, Dropdown, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  HiCalendarDays,
  HiClock,
  HiUsers,
  HiCheckCircle,
  HiXCircle,
  HiExclamationTriangle,
  HiPlus,
  HiVideoCamera,
  HiMicrophone,
  HiMapPin,
  HiClipboardDocumentList,
  HiChartBar,
  HiArrowTrendingUp,
  HiPresentationChartLine,
  HiMagnifyingGlass,
  HiFunnel,
  HiArrowPath,
  HiDocumentText,
  HiLightBulb,
  HiCalendar,
  HiDevicePhoneMobile
} from 'react-icons/hi2';

const MeetingAssist = () => {
  const navigate = useNavigate();
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [showActionItemModal, setShowActionItemModal] = useState(false);
  const [showMeetingDetailModal, setShowMeetingDetailModal] = useState(false);
  const [showRoomBookingModal, setShowRoomBookingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    participants: '',
    room: '',
    type: 'Regular',
    priority: 'Medium'
  });
  const [newActionItem, setNewActionItem] = useState({
    title: '',
    assignee: '',
    dueDate: '',
    priority: 'Medium',
    meetingId: '',
    description: ''
  });

  // Mock data for KPIs
  const kpiData = [
    {
      title: 'Total Meetings',
      value: '342',
      icon: HiCalendarDays,
      color: '#007bff',
      description: 'Meetings scheduled this month',
      trend: '+12%'
    },
    {
      title: 'Attended',
      value: '298',
      icon: HiCheckCircle,
      color: '#28a745',
      description: 'Successfully attended meetings',
      trend: '+8%'
    },
    {
      title: 'Avg Duration',
      value: '47 min',
      icon: HiClock,
      color: '#17a2b8',
      description: 'Average meeting duration',
      trend: '-5 min'
    },
    {
      title: 'Action Items',
      value: '156',
      icon: HiClipboardDocumentList,
      color: '#ffc107',
      description: 'Pending action items',
      trend: '+23'
    },
    {
      title: 'Room Utilization',
      value: '84%',
      icon: HiMapPin,
      color: '#6f42c1',
      description: 'Meeting room usage rate',
      trend: '+7%'
    },
    {
      title: 'Productivity Score',
      value: '92%',
      icon: HiChartBar,
      color: '#fd7e14',
      description: 'Meeting effectiveness rating',
      trend: '+4%'
    }
  ];

  // Mock meeting data
  const upcomingMeetings = [
    {
      id: 'MTG-001',
      title: 'Sprint Planning Meeting',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '90 min',
      participants: ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson'],
      room: 'Conference Room A',
      type: 'Planning',
      status: 'Scheduled',
      priority: 'High',
      agenda: 'Sprint 12 planning and task distribution',
      organizer: 'John Smith',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      actionItems: 3
    },
    {
      id: 'MTG-002',
      title: 'Client Review Session',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '60 min',
      participants: ['Sarah Johnson', 'Alex Wilson', 'Client Team'],
      room: 'Meeting Room B',
      type: 'Review',
      status: 'In Progress',
      priority: 'Critical',
      agenda: 'Q4 deliverables review with client',
      organizer: 'Sarah Johnson',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      actionItems: 1
    },
    {
      id: 'MTG-003',
      title: 'Team Standup',
      date: '2024-01-15',
      time: '9:00 AM',
      duration: '15 min',
      participants: ['Development Team'],
      room: 'Virtual',
      type: 'Standup',
      status: 'Completed',
      priority: 'Medium',
      agenda: 'Daily progress sync and blockers',
      organizer: 'Mike Davis',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      actionItems: 2
    },
    {
      id: 'MTG-004',
      title: 'Architecture Discussion',
      date: '2024-01-16',
      time: '11:00 AM',
      duration: '120 min',
      participants: ['Tech Leads', 'Senior Developers'],
      room: 'Conference Room C',
      type: 'Technical',
      status: 'Scheduled',
      priority: 'High',
      agenda: 'Microservices architecture design review',
      organizer: 'Alex Wilson',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      actionItems: 0
    },
    {
      id: 'MTG-005',
      title: 'Quarterly Business Review',
      date: '2024-01-17',
      time: '3:00 PM',
      duration: '180 min',
      participants: ['Executive Team', 'Department Heads'],
      room: 'Executive Boardroom',
      type: 'Review',
      status: 'Scheduled',
      priority: 'Critical',
      agenda: 'Q4 performance review and Q1 planning',
      organizer: 'Jennifer Kim',
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/...',
      actionItems: 0
    }
  ];

  // Mock action items
  const actionItems = [
    {
      id: 'AI-001',
      title: 'Update project timeline',
      assignee: 'John Smith',
      dueDate: '2024-01-18',
      priority: 'High',
      status: 'In Progress',
      meetingId: 'MTG-001',
      meetingTitle: 'Sprint Planning Meeting',
      description: 'Update the project timeline based on new requirements',
      progress: 60
    },
    {
      id: 'AI-002',
      title: 'Prepare demo environment',
      assignee: 'Mike Davis',
      dueDate: '2024-01-16',
      priority: 'Critical',
      status: 'Pending',
      meetingId: 'MTG-002',
      meetingTitle: 'Client Review Session',
      description: 'Set up demo environment for client presentation',
      progress: 30
    },
    {
      id: 'AI-003',
      title: 'Review security protocols',
      assignee: 'Sarah Johnson',
      dueDate: '2024-01-20',
      priority: 'Medium',
      status: 'Completed',
      meetingId: 'MTG-003',
      meetingTitle: 'Team Standup',
      description: 'Review and update current security protocols',
      progress: 100
    },
    {
      id: 'AI-004',
      title: 'Database optimization plan',
      assignee: 'Alex Wilson',
      dueDate: '2024-01-19',
      priority: 'High',
      status: 'In Progress',
      meetingId: 'MTG-004',
      meetingTitle: 'Architecture Discussion',
      description: 'Create database optimization strategy',
      progress: 45
    }
  ];

  // Mock room availability
  const meetingRooms = [
    {
      id: 'ROOM-001',
      name: 'Conference Room A',
      capacity: 12,
      equipment: ['Projector', 'Whiteboard', 'Video Conference'],
      availability: 'Available',
      nextMeeting: '3:00 PM',
      utilization: 75,
      location: 'Floor 2, Wing A'
    },
    {
      id: 'ROOM-002',
      name: 'Meeting Room B',
      capacity: 6,
      equipment: ['TV Screen', 'Conference Phone'],
      availability: 'Occupied',
      nextMeeting: 'Until 3:00 PM',
      utilization: 90,
      location: 'Floor 1, Wing B'
    },
    {
      id: 'ROOM-003',
      name: 'Executive Boardroom',
      capacity: 20,
      equipment: ['Large Display', 'Video Conference', 'Audio System'],
      availability: 'Available',
      nextMeeting: 'Tomorrow 9:00 AM',
      utilization: 60,
      location: 'Floor 3, Executive'
    },
    {
      id: 'ROOM-004',
      name: 'Huddle Space 1',
      capacity: 4,
      equipment: ['TV Screen', 'Whiteboard'],
      availability: 'Available',
      nextMeeting: '4:30 PM',
      utilization: 55,
      location: 'Floor 1, Wing A'
    }
  ];

  // Mock meeting templates
  const meetingTemplates = [
    {
      id: 'TEMP-001',
      name: 'Sprint Planning',
      duration: '90 min',
      agenda: 'Sprint goals, backlog refinement, task estimation',
      participants: 'Development Team, Product Owner, Scrum Master',
      type: 'Planning'
    },
    {
      id: 'TEMP-002',
      name: 'Daily Standup',
      duration: '15 min',
      agenda: 'Yesterday\'s progress, today\'s plan, blockers',
      participants: 'Development Team',
      type: 'Standup'
    },
    {
      id: 'TEMP-003',
      name: 'Client Review',
      duration: '60 min',
      agenda: 'Demo, feedback collection, next steps',
      participants: 'Project Team, Client Stakeholders',
      type: 'Review'
    },
    {
      id: 'TEMP-004',
      name: 'Retrospective',
      duration: '60 min',
      agenda: 'What went well, what didn\'t, action items',
      participants: 'Team Members, Facilitator',
      type: 'Retrospective'
    }
  ];

  const handleCreateMeeting = () => {
    console.log('Creating meeting:', newMeeting);
    setShowNewMeetingModal(false);
    setNewMeeting({
      title: '', description: '', date: '', time: '', duration: '60',
      participants: '', room: '', type: 'Regular', priority: 'Medium'
    });
  };

  const handleCreateActionItem = () => {
    console.log('Creating action item:', newActionItem);
    setShowActionItemModal(false);
    setNewActionItem({
      title: '', assignee: '', dueDate: '', priority: 'Medium',
      meetingId: '', description: ''
    });
  };

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetailModal(true);
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowRoomBookingModal(true);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'Scheduled': return '#007bff';
      case 'In Progress': return '#28a745';
      case 'Completed': return '#6c757d';
      case 'Cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredMeetings = upcomingMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || meeting.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredActionItems = actionItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Container fluid className="theme-fade-in" style={{ padding: '1rem 1.5rem' }}>
      {/* Header */}
      <div className="theme-page-header theme-text-center theme-mb-lg py-2">
        <h1 className="theme-page-title text-center d-flex align-items-center justify-content-center" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          <HiCalendarDays style={{ color: 'var(--primary-color)', marginRight: '0.5rem', fontSize: '1.6rem' }} />
          Meeting Assist Dashboard
        </h1>
        <p className="theme-page-subtitle text-center" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
          Streamline meeting management with intelligent scheduling and productivity insights
        </p>
      </div>

      {/* KPI Cards */}
      <Row className="theme-mb-lg">
        {kpiData.map((kpi, index) => (
          <Col md={4} lg={2} className="mb-3" key={index}>
            <div className="theme-kpi-card compact" style={{ 
              background: `linear-gradient(135deg, ${kpi.color}15, ${kpi.color}25)`,
              border: `1px solid ${kpi.color}30`,
              animationDelay: `${index * 0.1}s`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}>
              <div className="theme-kpi-icon" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: kpi.color }}>
                <kpi.icon />
              </div>
              <div className="theme-kpi-value" style={{ fontSize: '1.3rem', marginBottom: '0.3rem', color: kpi.color, fontWeight: 'bold' }}>
                {kpi.value}
              </div>
              <div className="theme-kpi-label" style={{ fontSize: '0.8rem', marginBottom: '0.3rem', fontWeight: '600' }}>
                {kpi.title}
              </div>
              <p className="text-center mt-1 text-muted small" style={{ fontSize: '0.7rem', marginBottom: '0.2rem' }}>
                {kpi.description}
              </p>
              <div className="text-center" style={{ fontSize: '0.65rem', color: kpi.trend.includes('+') ? '#28a745' : '#dc3545', fontWeight: '500' }}>
                {kpi.trend}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Row className="theme-mb-lg">
        <Col lg={12}>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button 
              variant="primary" 
              onClick={() => setShowNewMeetingModal(true)}
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
            >
              <HiPlus className="me-2" />
              Schedule Meeting
            </Button>
            <Button 
              variant="outline-success" 
              onClick={() => setShowActionItemModal(true)}
            >
              <HiClipboardDocumentList className="me-2" />
              Add Action Item
            </Button>
            <Button variant="outline-info">
              <HiVideoCamera className="me-2" />
              Join Meeting
            </Button>
            <Button variant="outline-warning">
              <HiMapPin className="me-2" />
              Find Room
            </Button>
          </div>
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="theme-mb-lg">
        {/* Upcoming Meetings - 70% */}
        <Col lg={8} className="mb-3">
          <div className="theme-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="theme-card-title" style={{ marginBottom: 0 }}>
                  <HiCalendarDays style={{ marginRight: '0.5rem', color: '#007bff' }} />
                  Upcoming Meetings
                </h5>
                <div className="d-flex gap-2">
                  <InputGroup style={{ width: '200px' }}>
                    <InputGroup.Text>
                      <HiMagnifyingGlass />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search meetings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ fontSize: '0.85rem' }}
                    />
                  </InputGroup>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm">
                      <HiFunnel className="me-1" />
                      {filterStatus === 'all' ? 'All' : filterStatus}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setFilterStatus('all')}>All Status</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterStatus('scheduled')}>Scheduled</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterStatus('in progress')}>In Progress</Dropdown.Item>
                      <Dropdown.Item onClick={() => setFilterStatus('completed')}>Completed</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="theme-card-body" style={{ padding: '1rem', flex: 1, overflow: 'auto' }}>
              {filteredMeetings.map((meeting) => (
                <div key={meeting.id} className="meeting-item" style={{ 
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--gray-200)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleViewMeeting(meeting)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ flex: 1 }}>
                      <h6 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                        {meeting.title}
                      </h6>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <Badge bg={getStatusColor(meeting.status).replace('#', '')} style={{ backgroundColor: getStatusColor(meeting.status) }}>
                          {meeting.status}
                        </Badge>
                        <Badge 
                          style={{ 
                            backgroundColor: getPriorityColor(meeting.priority),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        >
                          {meeting.priority}
                        </Badge>
                        <span className="badge bg-light text-dark" style={{ fontSize: '0.7rem' }}>
                          {meeting.type}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div className="d-flex align-items-center gap-1">
                          <HiCalendar style={{ fontSize: '0.9rem' }} />
                          {meeting.date} at {meeting.time}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <HiClock style={{ fontSize: '0.9rem' }} />
                          {meeting.duration}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <HiMapPin style={{ fontSize: '0.9rem' }} />
                          {meeting.room}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <HiUsers style={{ fontSize: '0.9rem' }} />
                        <span>{meeting.participants.length} participants</span>
                        {meeting.actionItems > 0 && (
                          <>
                            <HiClipboardDocumentList style={{ fontSize: '0.9rem', color: '#ffc107' }} />
                            <span style={{ color: '#ffc107' }}>{meeting.actionItems} action items</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <Button size="sm" variant="outline-primary" style={{ fontSize: '0.75rem' }}>
                        <HiVideoCamera style={{ marginRight: '0.3rem' }} />
                        Join
                      </Button>
                      <Button size="sm" variant="outline-secondary" style={{ fontSize: '0.75rem' }}>
                        <HiDocumentText style={{ marginRight: '0.3rem' }} />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        {/* Right Sidebar - 30% */}
        <Col lg={4} className="mb-3">
          {/* Meeting Rooms */}
          <div className="theme-card mb-3" style={{ height: '280px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1rem', marginBottom: 0 }}>
                <HiMapPin style={{ marginRight: '0.5rem', color: '#6f42c1' }} />
                Meeting Rooms
              </h5>
            </div>
            <div className="theme-card-body" style={{ padding: '1rem', flex: 1, overflow: 'auto' }}>
              {meetingRooms.map((room) => (
                <div key={room.id} className="room-item" style={{ 
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '6px',
                  border: '1px solid var(--gray-200)',
                  cursor: 'pointer'
                }}
                onClick={() => handleBookRoom(room)}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: 0 }}>
                      {room.name}
                    </h6>
                    <Badge bg={room.availability === 'Available' ? 'success' : 'danger'} style={{ fontSize: '0.65rem' }}>
                      {room.availability}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    <HiUsers style={{ marginRight: '0.3rem' }} />
                    {room.capacity} people • {room.location}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Next: {room.nextMeeting}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="theme-card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1rem', marginBottom: 0 }}>
                <HiClipboardDocumentList style={{ marginRight: '0.5rem', color: '#ffc107' }} />
                Action Items
              </h5>
            </div>
            <div className="theme-card-body" style={{ padding: '1rem', flex: 1, overflow: 'auto' }}>
              {filteredActionItems.slice(0, 5).map((item) => (
                <div key={item.id} className="action-item" style={{ 
                  padding: '0.75rem',
                  marginBottom: '0.75rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '6px',
                  border: '1px solid var(--gray-200)'
                }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: 0 }}>
                      {item.title}
                    </h6>
                    <Badge 
                      style={{ 
                        backgroundColor: getPriorityColor(item.priority),
                        fontSize: '0.65rem'
                      }}
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                    <strong>Assignee:</strong> {item.assignee}<br/>
                    <strong>Due:</strong> {item.dueDate}
                  </div>
                  <ProgressBar 
                    now={item.progress} 
                    style={{ height: '4px', marginBottom: '0.25rem' }}
                    variant={item.progress === 100 ? 'success' : item.progress > 50 ? 'info' : 'warning'}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {item.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Meeting Templates Section */}
      <Row className="theme-mb-lg">
        <Col lg={12}>
          <div className="theme-card">
            <div className="theme-card-header" style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
              <h5 className="theme-card-title" style={{ marginBottom: 0 }}>
                <HiLightBulb style={{ marginRight: '0.5rem', color: '#fd7e14' }} />
                Meeting Templates
              </h5>
            </div>
            <div className="theme-card-body" style={{ padding: '1rem' }}>
              <Row>
                {meetingTemplates.map((template) => (
                  <Col md={6} lg={3} key={template.id} className="mb-3">
                    <div className="template-card" style={{ 
                      padding: '1rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--gray-200)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '';
                    }}>
                      <h6 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                        {template.name}
                      </h6>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>
                          {template.type}
                        </Badge>
                        <span style={{ fontSize: '0.75rem', color: '#666' }}>
                          <HiClock style={{ marginRight: '0.3rem' }} />
                          {template.duration}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                        {template.agenda}
                      </p>
                      <Button size="sm" variant="outline-primary" style={{ fontSize: '0.75rem', width: '100%' }}>
                        Use Template
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* New Meeting Modal */}
      <Modal show={showNewMeetingModal} onHide={() => setShowNewMeetingModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiPlus className="me-2" /> Schedule New Meeting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meeting Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter meeting title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meeting Type</Form.Label>
                  <Form.Select
                    value={newMeeting.type}
                    onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                  >
                    <option value="Regular">Regular Meeting</option>
                    <option value="Standup">Daily Standup</option>
                    <option value="Planning">Sprint Planning</option>
                    <option value="Review">Review Meeting</option>
                    <option value="Retrospective">Retrospective</option>
                    <option value="Technical">Technical Discussion</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Meeting agenda and description"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Meeting Room</Form.Label>
                  <Form.Select
                    value={newMeeting.room}
                    onChange={(e) => setNewMeeting({...newMeeting, room: e.target.value})}
                  >
                    <option value="">Select Room</option>
                    <option value="Conference Room A">Conference Room A</option>
                    <option value="Meeting Room B">Meeting Room B</option>
                    <option value="Executive Boardroom">Executive Boardroom</option>
                    <option value="Huddle Space 1">Huddle Space 1</option>
                    <option value="Virtual">Virtual Meeting</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newMeeting.priority}
                    onChange={(e) => setNewMeeting({...newMeeting, priority: e.target.value})}
                  >
                    <option value="Low">🟢 Low Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="High">🟠 High Priority</option>
                    <option value="Critical">🔴 Critical Priority</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Participants (email addresses, comma separated)</Form.Label>
              <Form.Control
                type="text"
                placeholder="john@example.com, sarah@example.com"
                value={newMeeting.participants}
                onChange={(e) => setNewMeeting({...newMeeting, participants: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewMeetingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateMeeting}
            style={{ background: 'var(--bg-gradient)', border: 'none' }}
          >
            <HiPlus className="me-2" /> Schedule Meeting
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Action Item Modal */}
      <Modal show={showActionItemModal} onHide={() => setShowActionItemModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiClipboardDocumentList className="me-2" /> Add Action Item
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Action Item Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter action item"
                value={newActionItem.title}
                onChange={(e) => setNewActionItem({...newActionItem, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Detailed description of the action item"
                value={newActionItem.description}
                onChange={(e) => setNewActionItem({...newActionItem, description: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assignee</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Person responsible"
                    value={newActionItem.assignee}
                    onChange={(e) => setNewActionItem({...newActionItem, assignee: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newActionItem.dueDate}
                    onChange={(e) => setNewActionItem({...newActionItem, dueDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newActionItem.priority}
                    onChange={(e) => setNewActionItem({...newActionItem, priority: e.target.value})}
                  >
                    <option value="Low">🟢 Low Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="High">🟠 High Priority</option>
                    <option value="Critical">🔴 Critical Priority</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Related Meeting</Form.Label>
                  <Form.Select
                    value={newActionItem.meetingId}
                    onChange={(e) => setNewActionItem({...newActionItem, meetingId: e.target.value})}
                  >
                    <option value="">Select Meeting</option>
                    {upcomingMeetings.map(meeting => (
                      <option key={meeting.id} value={meeting.id}>{meeting.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActionItemModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateActionItem}
            style={{ background: 'var(--bg-gradient)', border: 'none' }}
          >
            <HiPlus className="me-2" /> Add Action Item
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Meeting Detail Modal */}
      <Modal show={showMeetingDetailModal} onHide={() => setShowMeetingDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiCalendarDays className="me-2" /> Meeting Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMeeting && (
            <div>
              <h5>{selectedMeeting.title}</h5>
              <div className="d-flex gap-2 mb-3">
                <Badge style={{ backgroundColor: getStatusColor(selectedMeeting.status) }}>
                  {selectedMeeting.status}
                </Badge>
                <Badge style={{ backgroundColor: getPriorityColor(selectedMeeting.priority) }}>
                  {selectedMeeting.priority}
                </Badge>
                <Badge bg="light" text="dark">{selectedMeeting.type}</Badge>
              </div>
              <div className="mb-3">
                <strong>Organizer:</strong> {selectedMeeting.organizer}<br/>
                <strong>Date & Time:</strong> {selectedMeeting.date} at {selectedMeeting.time}<br/>
                <strong>Duration:</strong> {selectedMeeting.duration}<br/>
                <strong>Location:</strong> {selectedMeeting.room}<br/>
              </div>
              <div className="mb-3">
                <strong>Agenda:</strong><br/>
                <p>{selectedMeeting.agenda}</p>
              </div>
              <div className="mb-3">
                <strong>Participants:</strong><br/>
                {selectedMeeting.participants.map((participant, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-2 mb-1">
                    {participant}
                  </Badge>
                ))}
              </div>
              <div className="d-flex gap-2">
                <Button variant="primary" size="sm">
                  <HiVideoCamera className="me-1" />
                  Join Meeting
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <HiCalendar className="me-1" />
                  Add to Calendar
                </Button>
                <Button variant="outline-info" size="sm">
                  <HiDocumentText className="me-1" />
                  Meeting Notes
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMeetingDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Room Booking Modal */}
      <Modal show={showRoomBookingModal} onHide={() => setShowRoomBookingModal(false)} centered>
        <Modal.Header closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiMapPin className="me-2" /> Book Meeting Room
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <div>
              <h5>{selectedRoom.name}</h5>
              <div className="mb-3">
                <strong>Capacity:</strong> {selectedRoom.capacity} people<br/>
                <strong>Location:</strong> {selectedRoom.location}<br/>
                <strong>Status:</strong> <Badge bg={selectedRoom.availability === 'Available' ? 'success' : 'danger'}>
                  {selectedRoom.availability}
                </Badge><br/>
                <strong>Next Meeting:</strong> {selectedRoom.nextMeeting}
              </div>
              <div className="mb-3">
                <strong>Equipment:</strong><br/>
                {selectedRoom.equipment.map((item, index) => (
                  <Badge key={index} bg="light" text="dark" className="me-2 mb-1">
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="mb-3">
                <strong>Utilization Rate:</strong><br/>
                <ProgressBar now={selectedRoom.utilization} label={`${selectedRoom.utilization}%`} />
              </div>
              {selectedRoom.availability === 'Available' && (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Time</Form.Label>
                        <Form.Control type="time" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Duration</Form.Label>
                    <Form.Select>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRoomBookingModal(false)}>
            Cancel
          </Button>
          {selectedRoom?.availability === 'Available' && (
            <Button variant="primary">
              <HiMapPin className="me-2" />
              Book Room
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .theme-fade-in {
          animation: fadeIn 0.6s ease-in;
        }

        .theme-kpi-card {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .meeting-item:hover,
        .room-item:hover,
        .action-item:hover,
        .template-card:hover {
          background: rgba(0,0,0,0.02) !important;
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

export default MeetingAssist; 