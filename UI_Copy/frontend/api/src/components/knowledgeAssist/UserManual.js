import React from 'react';
import { Modal, Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import { 
  HiBookOpen, 
  HiHome, 
  HiLightBulb, 
  HiArrowsRightLeft, 
  HiCalendarDays, 
  HiChartBar,
  HiCog6Tooth,
  HiPlusCircle,
  HiMagnifyingGlass,
  HiUsers,
  HiDocumentText,
  HiVideoCamera,
  HiPhone,
  HiClipboardDocumentList,
  HiMapPin,
  HiXMark
} from 'react-icons/hi2';

const UserManual = ({ show, onHide }) => {
  const manualSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <HiHome />,
      content: [
        {
          subtitle: "Welcome to VibeCoding Knowledge Platform",
          text: "This platform helps you manage Standard Operating Procedures (SOPs), facilitate knowledge transfer, and streamline meeting management."
        },
        {
          subtitle: "Navigation",
          text: "Use the always-visible sidebar on the left to navigate between different sections. Icons show by default, hover to see full names."
        },
        {
          subtitle: "Dashboard Overview",
          text: "The main dashboard shows key metrics, recent activity, and quick access to all major features of the platform."
        }
      ]
    },
    {
      id: "sidebar-navigation",
      title: "Sidebar Navigation",
      icon: <HiBookOpen />,
      content: [
        {
          subtitle: "Always-Visible Design",
          text: "The sidebar is always visible with icon-only display. Hover over it to expand and see full menu names."
        },
        {
          subtitle: "Main Sections",
          text: "• Dashboard - Main overview and statistics\n• Knowledge Assist - AI-powered knowledge analytics\n• Transition Assist - Knowledge transfer tools\n• Meeting Assist - Meeting management features\n• Analytics - Detailed performance metrics"
        },
        {
          subtitle: "Categories",
          text: "Browse SOPs by categories like Windows Administration, Linux Administration, Network Management, Database Management, and more."
        },
        {
          subtitle: "Quick Actions",
          text: "Access frequently used actions like adding new SOPs, viewing recent activity, and exporting data."
        }
      ]
    },
    {
      id: "knowledge-assist",
      title: "Knowledge Assist",
      icon: <HiLightBulb />,
      content: [
        {
          subtitle: "AI-Powered Analytics",
          text: "Knowledge Assist provides intelligent insights into your knowledge base performance and identifies gaps in documentation."
        },
        {
          subtitle: "Key Features",
          text: "• Duplicate article detection\n• Low-scoring article identification\n• Automatic KB generation from tickets\n• Success and failure rate tracking\n• Performance analytics"
        },
        {
          subtitle: "Common Issues Analysis",
          text: "View high-frequency incidents without proper documentation and create SOPs directly from the analysis."
        },
        {
          subtitle: "Creating Documentation",
          text: "Click 'Create Doc' next to any issue to automatically generate a new SOP template based on the incident data."
        }
      ]
    },
    {
      id: "transition-assist",
      title: "Transition Assist",
      icon: <HiArrowsRightLeft />,
      content: [
        {
          subtitle: "Intelligent Knowledge Transfer",
          text: "Streamline knowledge transfer with AI-powered call analysis and SOP matching during handover sessions."
        },
        {
          subtitle: "Live Call Integration",
          text: "• View ongoing calls in real-time\n• Join Microsoft Teams meetings\n• Monitor call participants and duration\n• Access call recordings"
        },
        {
          subtitle: "SOP Matching",
          text: "AI analyzes call content and suggests relevant existing SOPs or recommends creating new documentation for knowledge gaps."
        },
        {
          subtitle: "Call Summary Generation",
          text: "Automatically generate meeting summaries with action items, key discussion points, and next steps."
        }
      ]
    },
    {
      id: "meeting-assist",
      title: "Meeting Assist",
      icon: <HiCalendarDays />,
      content: [
        {
          subtitle: "Smart Meeting Management",
          text: "Comprehensive meeting scheduling, room booking, and productivity tracking with intelligent insights."
        },
        {
          subtitle: "Meeting Scheduling",
          text: "• Create meetings with templates\n• Set priorities and durations\n• Invite participants\n• Choose meeting rooms or virtual options"
        },
        {
          subtitle: "Room Management",
          text: "• View real-time room availability\n• Check equipment and capacity\n• Book rooms directly\n• Monitor utilization rates"
        },
        {
          subtitle: "Action Items",
          text: "• Create and assign action items\n• Track progress with progress bars\n• Set due dates and priorities\n• Link to specific meetings"
        },
        {
          subtitle: "Templates",
          text: "Use pre-built templates for Sprint Planning, Daily Standups, Client Reviews, and Retrospectives."
        }
      ]
    },
    {
      id: "sop-management",
      title: "SOP Management",
      icon: <HiDocumentText />,
      content: [
        {
          subtitle: "Creating SOPs",
          text: "Click the '+' button in Quick Actions or use 'Add New SOP' to create new Standard Operating Procedures."
        },
        {
          subtitle: "SOP Structure",
          text: "• Title and description\n• Category assignment\n• Priority levels\n• Tags for searchability\n• Step-by-step procedures\n• Last updated tracking"
        },
        {
          subtitle: "Editing and Updates",
          text: "Click on any SOP to view, edit, or update. Changes are tracked with timestamps and version history."
        },
        {
          subtitle: "Search and Filter",
          text: "Use the search functionality to find SOPs by title, description, tags, or category. Apply filters for advanced searching."
        }
      ]
    },
    {
      id: "analytics",
      title: "Analytics & Reporting",
      icon: <HiChartBar />,
      content: [
        {
          subtitle: "Performance Metrics",
          text: "View comprehensive analytics on knowledge base usage, meeting effectiveness, and system performance."
        },
        {
          subtitle: "Key Metrics",
          text: "• Total SOPs and usage statistics\n• Meeting productivity scores\n• Knowledge transfer success rates\n• User engagement metrics\n• Response time analytics"
        },
        {
          subtitle: "Data Export",
          text: "Export data in various formats for external analysis and reporting. Use the 'Export Data' option in Quick Actions."
        },
        {
          subtitle: "Trends and Insights",
          text: "Identify trends in knowledge usage, meeting patterns, and areas that need attention or improvement."
        }
      ]
    },
    {
      id: "tips-tricks",
      title: "Tips & Best Practices",
      icon: <HiCog6Tooth />,
      content: [
        {
          subtitle: "Effective SOP Writing",
          text: "• Use clear, concise language\n• Include step-by-step instructions\n• Add relevant tags for discoverability\n• Update regularly based on feedback\n• Include screenshots when helpful"
        },
        {
          subtitle: "Knowledge Transfer",
          text: "• Record important calls for reference\n• Create SOPs immediately after resolving new issues\n• Use AI suggestions to improve documentation\n• Regular review and update cycles"
        },
        {
          subtitle: "Meeting Efficiency",
          text: "• Use templates for recurring meetings\n• Set clear agendas and objectives\n• Assign action items with due dates\n• Follow up on previous action items"
        },
        {
          subtitle: "Search Optimization",
          text: "• Use relevant keywords in SOPs\n• Maintain consistent naming conventions\n• Regular category organization\n• Tag content appropriately"
        }
      ]
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <HiXMark />,
      content: [
        {
          subtitle: "Common Issues",
          text: "• If sidebar doesn't expand: Try refreshing the page\n• If SOPs don't load: Check your internet connection\n• If meetings don't sync: Verify Microsoft Teams integration\n• If search isn't working: Clear browser cache"
        },
        {
          subtitle: "Browser Compatibility",
          text: "This platform works best with modern browsers (Chrome, Firefox, Safari, Edge). Ensure JavaScript is enabled."
        },
        {
          subtitle: "Performance Tips",
          text: "• Keep browser updated\n• Close unnecessary tabs\n• Clear cache regularly\n• Use recommended screen resolution (1920x1080 or higher)"
        },
        {
          subtitle: "Getting Help",
          text: "Contact your system administrator or IT support team for technical issues. Use the feedback option for feature requests."
        }
      ]
    }
  ];

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered
      className="user-manual-modal"
    >
      <Modal.Header 
        closeButton 
        style={{ 
          background: 'linear-gradient(180deg, #2D2D8F 0%, #006FBA 54.89%, #00E5D4 100%)', 
          color: 'white',
          border: 'none'
        }}
      >
        <Modal.Title className="d-flex align-items-center">
          <HiBookOpen style={{ marginRight: '0.75rem', fontSize: '1.5rem' }} />
          User Manual - VibeCoding Knowledge Platform
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '80vh', overflow: 'auto', padding: '2rem' }}>
        <Container fluid>
          {/* Introduction */}
          <Row className="mb-4">
            <Col>
              <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #dee2e6',
                textAlign: 'center'
              }}>
                <h4 style={{ color: '#2D2D8F', marginBottom: '1rem' }}>
                  Welcome to VibeCoding Knowledge Platform
                </h4>
                <p style={{ color: '#495057', marginBottom: 0, lineHeight: '1.6' }}>
                  A comprehensive AI-powered platform for knowledge management, seamless transitions, 
                  and intelligent meeting assistance. This manual will guide you through all features and best practices.
                </p>
              </div>
            </Col>
          </Row>

          {/* Quick Navigation */}
          <Row className="mb-4">
            <Col>
              <Card style={{ border: '1px solid #e9ecef' }}>
                <Card.Header style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                  <h5 style={{ margin: 0, color: '#495057' }}>
                    <HiMagnifyingGlass style={{ marginRight: '0.5rem' }} />
                    Quick Navigation
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {manualSections.map((section) => (
                      <Col md={4} sm={6} key={section.id} className="mb-2">
                        <div 
                          style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => {
                            document.getElementById(section.id).scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#e9ecef';
                            e.target.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#f8f9fa';
                            e.target.style.transform = 'translateY(0)';
                          }}
                        >
                          <span style={{ marginRight: '0.5rem', color: '#006FBA' }}>
                            {section.icon}
                          </span>
                          {section.title}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Manual Sections */}
          <Accordion defaultActiveKey="getting-started">
            {manualSections.map((section, index) => (
              <Accordion.Item 
                eventKey={section.id} 
                key={section.id}
                id={section.id}
                style={{ marginBottom: '1rem', border: '1px solid #e9ecef', borderRadius: '8px' }}
              >
                <Accordion.Header style={{ background: '#f8f9fa' }}>
                  <div className="d-flex align-items-center">
                    <span style={{ marginRight: '0.75rem', color: '#006FBA', fontSize: '1.2rem' }}>
                      {section.icon}
                    </span>
                    <span style={{ fontWeight: '600', color: '#2D2D8F' }}>
                      {section.title}
                    </span>
                  </div>
                </Accordion.Header>
                <Accordion.Body style={{ padding: '1.5rem' }}>
                  {section.content.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: idx < section.content.length - 1 ? '1.5rem' : 0 }}>
                      <h6 style={{ 
                        color: '#2D2D8F', 
                        marginBottom: '0.75rem',
                        fontWeight: '600',
                        fontSize: '1rem'
                      }}>
                        {item.subtitle}
                      </h6>
                      <p style={{ 
                        color: '#495057', 
                        lineHeight: '1.6',
                        marginBottom: 0,
                        whiteSpace: 'pre-line'
                      }}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          {/* Contact Information */}
          <Row className="mt-4">
            <Col>
              <div style={{
                background: 'linear-gradient(135deg, #2D2D8F15, #006FBA15)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #006FBA30',
                textAlign: 'center'
              }}>
                <h5 style={{ color: '#2D2D8F', marginBottom: '1rem' }}>
                  Need More Help?
                </h5>
                <p style={{ color: '#495057', marginBottom: '1rem' }}>
                  If you need additional assistance or have suggestions for improving this platform:
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '1rem',
                  flexWrap: 'wrap' 
                }}>
                  <div style={{ 
                    background: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    fontSize: '0.9rem'
                  }}>
                    📧 support@vibecoding.com
                  </div>
                  <div style={{ 
                    background: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    fontSize: '0.9rem'
                  }}>
                    📞 +1 (555) 123-4567
                  </div>
                  <div style={{ 
                    background: 'white',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    fontSize: '0.9rem'
                  }}>
                    🌐 help.vibecoding.com
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>

      {/* Custom Styles */}
      <style jsx>{`
        .user-manual-modal .modal-content {
          border: none;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        
        .user-manual-modal .modal-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .user-manual-modal .modal-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .user-manual-modal .modal-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .user-manual-modal .modal-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .user-manual-modal .accordion-button {
          background: #f8f9fa !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        .user-manual-modal .accordion-button:not(.collapsed) {
          background: linear-gradient(135deg, #2D2D8F15, #006FBA15) !important;
          color: #2D2D8F !important;
        }
        
        .user-manual-modal .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(45, 45, 143, 0.25) !important;
        }
      `}</style>
    </Modal>
  );
};

export default UserManual; 