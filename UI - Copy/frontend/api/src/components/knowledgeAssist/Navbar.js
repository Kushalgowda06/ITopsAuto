import React, { useState, useEffect } from 'react';
import { Navbar, Container, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  HiUser, 
  HiCog6Tooth, 
  HiArrowRightOnRectangle,
  HiBell,
  HiSun,
  HiMoon,
  HiMagnifyingGlass,
  HiBookOpen
} from 'react-icons/hi2';


const CustomNavbar = ({ onLogout }) => {
  const [notifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    setDarkMode(isDark);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    const nextTheme = nextDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleQuickSearch = () => {
    const searchElement = document.querySelector('.hero-search');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDocumentation = () => {
    window.open('/docs/deployment.html', '_blank');
  };



  // Consistent button styling for reduced height navbar
  const buttonStyle = {
    padding: '6px 10px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 'var(--radius-md)',
    transition: 'var(--transition-fast)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    minWidth: '36px',
    height: '36px'
  };

  return (
    <>
      <Navbar expand="lg" className="theme-navbar fixed-top" style={{ height: '56px', minHeight: '56px', maxHeight: '56px' }}>
        <Container fluid style={{ height: '100%', alignItems: 'center' }}>
          {/* Left - Brand */}
          <div className="d-flex align-items-center">
            <Navbar.Brand 
              className="d-flex align-items-center" 
              onClick={handleLogoClick}
              style={{ 
                height: '56px', 
                overflow: 'hidden',
                margin: '0',
                padding: '0',
                cursor: 'pointer'
              }}
            >
              <img 
                src="/assets/congizant_logo.png" 
                alt="Company Logo"
                style={{ 
                  height: '50px',
                  width: 'auto',
                  objectFit: 'contain',
                  maxHeight: '50px',
                  position: 'relative',
                  top: '0',
                  marginLeft: '0'
                }}
              />
            </Navbar.Brand>
          </div>

          {/* Spacer */}
          <div className="flex-grow-1"></div>

          {/* Right - Enhanced Icon Bar */}
          <div className="d-flex align-items-center gap-1">
            
            {/* Documentation */}
            <button 
              className="navbar-btn"
              onClick={handleDocumentation}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              title="Documentation"
            >
              <HiBookOpen />
            </button>

            {/* Notifications */}
            <Dropdown show={showNotifications} onToggle={toggleNotifications} align="end">
              <Dropdown.Toggle 
                as="button"
                className="navbar-btn position-relative"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'rgba(255, 255, 255, 0.9)';
                }}
                title="Notifications"
              >
                <HiBell />
                {notifications > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {notifications}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: '280px' }}>
                <Dropdown.Header>
                  <strong>Notifications ({notifications})</strong>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <strong>New SOP Added</strong>
                      <br />
                      <small className="text-muted">Windows Server Configuration</small>
                    </div>
                    <small className="text-muted">2m ago</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <strong>Review Required</strong>
                      <br />
                      <small className="text-muted">Database Backup Procedure</small>
                    </div>
                    <small className="text-muted">1h ago</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-center">
                  <small>View All Notifications</small>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Theme Toggle */}
            <button 
              className="navbar-btn"
              onClick={toggleDarkMode}
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <HiSun /> : <HiMoon />}
            </button>

            {/* Settings */}
            <button 
              className="navbar-btn"
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.9)';
              }}
              title="Settings"
            >
              <HiCog6Tooth />
            </button>

            {/* User Profile */}
            <Dropdown align="end">
              <Dropdown.Toggle 
                as="button"
                className="navbar-btn"
                style={{
                  ...buttonStyle,
                  width: '36px',
                  height: '36px',
                  padding: '0',
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <HiUser />
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ minWidth: '200px' }}>
                <Dropdown.Header className="text-center">
                  <strong>Admin User</strong>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <HiUser className="me-2" />
                  Profile
                </Dropdown.Item>
                <Dropdown.Item>
                  <HiCog6Tooth className="me-2" />
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger" onClick={handleLogout}>
                  <HiArrowRightOnRectangle className="me-2" />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>


    </>
  );
};

export default CustomNavbar; 