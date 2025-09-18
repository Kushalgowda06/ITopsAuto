import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/ITSM/MainLayout';
import { 
  ChevronLeftIcon,
  CogIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const ProfileDropdown = ({ user, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user ID if not available
  const userId = user?.id || user?.user_id || `USR${Date.now().toString().slice(-6)}`;
  const userName = user?.name || 'Admin User';
  const userRole = user?.role || 'Administrator';

  // Get first letter of name for avatar
  const avatarLetter = userName.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowLogoutConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = userId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setIsOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-royal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
          {avatarLetter}
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-80 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
        >
          {/* User Info Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-royal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {avatarLetter}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{userName}</h3>
                <p className="text-gray-400 text-sm">{userRole}</p>
              </div>
            </div>
            
            {/* User ID with Copy Button */}
            <div className="mt-3 flex items-center justify-between bg-dark-800/50 rounded-lg p-2">
              <div>
                <p className="text-gray-400 text-xs">User ID</p>
                <p className="text-white text-sm font-mono">{userId}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  copied 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-600/20 hover:bg-gray-600/40 text-gray-400 hover:text-white'
                }`}
                title={copied ? 'Copied!' : 'Copy User ID'}
              >
                {copied ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Menu Options */}
          <div className="p-2">
            {/* View Profile */}
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <EyeIcon className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            {/* Edit Profile */}
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <PencilIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            {/* Change Password */}
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <KeyIcon className="w-4 h-4" />
              <span>Change Password</span>
            </button>

            <div className="my-2 border-t border-white/10"></div>

            {/* Logout */}
            {!showLogoutConfirm ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm mb-3">Are you sure you want to log out?</p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    Yes, Log Out
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ITSMPage = () => {
  const { user, logout } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-900 text-white"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-light-900/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center space-x-6">
              <Link 
                to="/dashboard"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              
              <div className="h-6 border-l border-gray-600"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-orange to-royal-900 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">ITOps</h1>
                  <p className="text-sm text-gray-400"></p>
                </div>
              </div>
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown user={user} logout={logout} />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative">
        <MainLayout />
      </div>
    </motion.div>
  );
};

export default ITSMPage; 