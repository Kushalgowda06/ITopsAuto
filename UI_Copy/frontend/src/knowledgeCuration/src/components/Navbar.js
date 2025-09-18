import React, { useState, useEffect } from 'react';
import { Navbar, Container, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
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

import {
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  PlayIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowPathIcon,
  LightBulbIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';




const CustomNavbar = ({ onLogout }) => {
  const [notifications] = useState(3);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = 'dark';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    setDarkMode(isDark);
  }, []);

  const handleLogoClick = () => {
    navigate('/knowledge-assist');
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
        <></>

        <div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="border-bottom sticky-top shadow-lg"
        >
          <div className="container px-3 py-3">
            <div className="d-flex align-items-center justify-content-between">

              {/* Navigation */}
              <div className="d-flex align-items-center gap-3">
                <Link
                  to="/itops"
                  className="p-2 glass-button rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </Link>

                <div className="vr mx-3"></div>

                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded bg-gradient text-white" style={{ width: '32px', height: '32px', background: 'linear-gradient(to bottom right, #FF6A00, #1E3A8A)' }}>
                    <HiCog6Tooth className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="h5 fw-bold text-white mb-0" style={{
                      fontSize: '0.85rem',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>Knowledge Assist</h3>
                    <p className="small theme-page-subtitle txt-color-white text-muted"></p>
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              {/* <ProfileDropdown user={user} logout={logout} /> */}
            </div>
          </div>
        </div>

      </Navbar>


    </>
  );
};

export default CustomNavbar; 