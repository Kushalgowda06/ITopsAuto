import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Typography, Divider, Tooltip } from '@mui/material';
import { HiXMark, HiBookOpen, HiHome, HiChartBar, HiPlusCircle, HiClock, HiArrowDownTray, HiLightBulb, HiArrowsRightLeft, HiCalendarDays, HiQuestionMarkCircle } from 'react-icons/hi2';
import { HiGlobeAlt, HiCircleStack, HiCog6Tooth, HiShieldCheck, HiCloud } from 'react-icons/hi2';
import { FaWindows, FaLinux, FaAws, FaMicrosoft } from 'react-icons/fa';
import { SiGooglecloud } from 'react-icons/si';
import UserManual from './UserManual';

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
    'HiShieldCheck': HiShieldCheck,
    'HiCloud': HiCloud,
    'SiGooglecloud': SiGooglecloud,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : <HiHome />;
};

const Sidebar = ({ categories, onCategoryClick }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUserManual, setShowUserManual] = useState(false);

  const handleCategoryClick = (category) => {
    onCategoryClick(category);
    navigate(`/category/${category.id}`);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAnalyticsClick = () => {
    navigate('/analytics');
  };

  // New navigation handlers for assist pages
  const handleKnowledgeAssistClick = () => {
    navigate('/knowledge-assist');
  };

  const handleTransitionAssistClick = () => {
    navigate('/transition-assist');
  };

  const handleMeetingAssistClick = () => {
    navigate('/meeting-assist');
  };

  // Quick Actions handlers
  const handleAddSOP = () => {
    window.dispatchEvent(new CustomEvent('openAddSOPModal'));
  };

  const handleRecentActivity = () => {
    navigate('/recent-activity');
  };

  const handleExportData = () => {
    window.dispatchEvent(new CustomEvent('openExportModal'));
  };

  const handleUserManual = () => {
    setShowUserManual(true);
  };

  // Sidebar item component with hover tooltip
  const SidebarItem = ({ icon, text, onClick, badge = null }) => (
    <Tooltip title={text} placement="right" arrow>
      <div 
        className="theme-sidebar-item-icon-only" 
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          padding: '12px',
          margin: '4px 8px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1.2rem',
          position: 'relative',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.transform = 'translateX(0)';
        }}
      >
        <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>
          {icon}
        </div>
        {isExpanded && (
          <span style={{ 
            marginLeft: '12px', 
            fontSize: '0.9rem',
            fontWeight: '500',
            opacity: 1,
            transition: 'opacity 0.3s ease'
          }}>
            {text}
          </span>
        )}
        {badge && (
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '10px',
            padding: '2px 6px',
            fontSize: '0.7rem',
            fontWeight: '600'
          }}>
            {badge}
          </div>
        )}
      </div>
    </Tooltip>
  );

  return (
    <div 
      className="theme-sidebar-always-visible"
      style={{
        position: 'fixed',
        top: '56px',
        left: 0,
        width: isExpanded ? '280px' : window.innerWidth <= 768 ? '60px' : '80px',
        height: 'calc(100vh - 56px)',
        zIndex: 1040,
        transition: 'width 0.3s ease',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: 'linear-gradient(180deg, #2D2D8F 0%, #006FBA 54.89%, #00E5D4 100%)',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div style={{ 
        padding: '16px 12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: isExpanded ? 'left' : 'center'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isExpanded ? 'flex-start' : 'center',
          color: 'white'
        }}>
          <HiBookOpen style={{ fontSize: '1.4rem', minWidth: '20px' }} />
          {isExpanded && (
            <div style={{ marginLeft: '12px' }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: 'white', 
                fontSize: '1rem',
                lineHeight: 1.2,
                margin: 0
              }}>
                Navigation
              </Typography>
              <Typography variant="caption" sx={{ 
                opacity: 0.8, 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1
              }}>
                Browse sections
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div style={{ padding: '8px 0' }}>
        <SidebarItem icon={<HiHome />} text="Dashboard" onClick={handleHomeClick} />
        <SidebarItem icon={<HiLightBulb />} text="Knowledge Assist" onClick={handleKnowledgeAssistClick} />
        <SidebarItem icon={<HiArrowsRightLeft />} text="Transition Assist" onClick={handleTransitionAssistClick} />
        <SidebarItem icon={<HiCalendarDays />} text="Meeting Assist" onClick={handleMeetingAssistClick} />
        <SidebarItem icon={<HiChartBar />} text="Analytics" onClick={handleAnalyticsClick} />
      </div>

      {/* Categories Section */}
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 16px' }} />
      
      {isExpanded && (
        <div style={{ padding: '8px 16px 4px' }}>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            fontSize: '0.7rem'
          }}>
            Categories
          </Typography>
        </div>
      )}

      <div style={{ padding: '4px 0' }}>
        {categories.map((category) => (
          <SidebarItem 
            key={category.id}
            icon={getIconComponent(category.icon)}
            text={category.name}
            onClick={() => handleCategoryClick(category)}
            badge={isExpanded ? category.count : null}
          />
        ))}
      </div>

      {/* Quick Actions Section */}
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '8px 16px' }} />
      
      {isExpanded && (
        <div style={{ padding: '8px 16px 4px' }}>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            fontSize: '0.7rem'
          }}>
            Quick Actions
          </Typography>
        </div>
      )}

      <div style={{ padding: '4px 0' }}>
        <SidebarItem icon={<HiPlusCircle />} text="Add New SOP" onClick={handleAddSOP} />
        <SidebarItem icon={<HiClock />} text="Recent Activity" onClick={handleRecentActivity} />
        <SidebarItem icon={<HiArrowDownTray />} text="Export Data" onClick={handleExportData} />
        <SidebarItem icon={<HiQuestionMarkCircle />} text="User Manual" onClick={handleUserManual} />
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .theme-sidebar-always-visible::-webkit-scrollbar {
          width: 4px;
        }
        
        .theme-sidebar-always-visible::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .theme-sidebar-always-visible::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        .theme-sidebar-always-visible::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* User Manual Modal */}
      <UserManual 
        show={showUserManual} 
        onHide={() => setShowUserManual(false)} 
      />
    </div>
  );
};

export default Sidebar; 