import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChartBarIcon,
  ChevronLeftIcon,
  ChatBubbleBottomCenterTextIcon,
  PlayIcon,
  CpuChipIcon,
  PresentationChartLineIcon,
  BeakerIcon,
  CircleStackIcon,
  SparklesIcon,
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

  const userId = user?.id || user?.user_id || `USR${Date.now().toString().slice(-6)}`;
  const userName = user?.name || 'Admin User';
  const userRole = user?.role || 'Administrator';
  const avatarLetter = userName.charAt(0).toUpperCase();

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-all duration-300 group"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-royal-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
          {avatarLetter}
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-full mt-2 w-80 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
        >
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
                {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <EyeIcon className="w-4 h-4" />
              <span>View Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <PencilIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <KeyIcon className="w-4 h-4" />
              <span>Change Password</span>
            </button>
            <div className="my-2 border-t border-white/10"></div>
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

const AnalyticsPage = () => {
  const { user, logout } = useAuth();
  
  // Analytics specific bots
  const analyticsBots = [
    {
      id: 'cost-optimization',
      name: 'Cost Optimization Recommendation Agent',
      description: 'Analyzes resource usage patterns and provides intelligent cost optimization recommendations to maximize efficiency and reduce expenses.',
      avatar: '💰',
      gradient: 'from-neon-purple to-royal-600',
      capabilities: [
        'Cost Analysis & Reporting',
        'Resource Optimization',
        'Budget Forecasting',
        'Savings Recommendations'
      ]
    },
    {
      id: 'unix-permission',
      name: 'Unix File Permission Agent',
      description: 'Manages Unix file permissions, security policies, and access control optimization with advanced permission analysis.',
      avatar: '🔐',
      gradient: 'from-neon-purple to-royal-600',
      capabilities: [
        'Permission Management',
        'Security Analysis',
        'Access Control Optimization',
        'Compliance Monitoring'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-900 text-white">
      {/* Header */}
      <header className="bg-light-900/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard"
                className="p-2 glass-button rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-royal-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium">Analytics</h1>
                  <p className="text-sm text-gray-400">Data Intelligence & ML AI</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-2">
              {/* image tags here */}
                {/* <div className="w-6 h-6">
                  
                </div> */}
                <span className="hidden sm:block font-bold break-words">
                  <span className="text-white font-black">  Autonomous IT Operations Toolkit</span>
                </span>
              </Link>
              
              {/* Profile Dropdown */}
              <ProfileDropdown user={user} logout={logout} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Motion Background */}
      <section className="py-16 px-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Floating data elements */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-neon-purple/20 text-2xl font-mono"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: Math.random() * 8 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                {['📊', '📈', '🔍', '💹', '📉', '⚡', '🔢', '📋'][Math.floor(Math.random() * 8)]}
              </motion.div>
            ))}
          </div>
          
          {/* Gradient data waves */}
          <motion.div
            className="absolute inset-0 particle-bg opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        </div>
        
        <div className="max-w-full mx-auto relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 overflow-visible"
          >
            <motion.h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium mb-6 px-6 leading-relaxed break-words"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ wordBreak: 'keep-all', whiteSpace: 'normal' }}
            >
              <span className="gradient-text block mb-2">
                Analytics & Intelligence
              </span>
              <span className="block text-white">
                AI Assistants
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-white mx-auto leading-relaxed text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Advanced data analytics, machine learning, and business intelligence powered by cutting-edge AI technology
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex items-center justify-center space-x-2 text-neon-purple"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <SparklesIcon className="w-6 h-6" />
              </motion.div>
              <span className="text-lg font-medium">Choose your Analytics AI specialist</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <SparklesIcon className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Centered Bot Cards in Single Row */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"
            >
              {analyticsBots.map((bot, index) => (
                <motion.div
                  key={bot.id}
                  initial={{ 
                    opacity: 0, 
                    y: 60, 
                    scale: 0.8,
                    rotateY: -15,
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    rotateY: 0,
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -15,
                    rotateY: 5,
                    boxShadow: '0 25px 50px rgba(139, 92, 246, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative perspective-1000"
                >
                  <motion.div 
                    className="glass-card p-8 h-full relative overflow-hidden transition-all duration-300 group-hover:neon-glow preserve-3d"
                    whileHover={{ rotateX: 5 }}
                  >
                    {/* Enhanced Background Pattern */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${bot.gradient} opacity-0 group-hover:opacity-15 transition-all duration-500`}
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    />
                    
                    {/* Enhanced Shimmer Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="shimmer-effect w-full h-full"></div>
                    </div>

                    {/* Glowing border effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0.95 }}
                      whileHover={{ scale: 1 }}
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${bot.gradient} p-[2px]`}>
                        <div className="w-full h-full bg-dark-900/90 rounded-xl"></div>
                      </div>
                    </motion.div>

                    {/* Bot Avatar */}
                    <div className="text-center mb-6 relative z-10">
                      <motion.div 
                        className={`w-24 h-24 bg-gradient-to-br ${bot.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2 * index, type: "spring", stiffness: 200, damping: 15 }}
                        whileHover={{ rotate: 15, scale: 1.15 }}
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 * index }}
                        >
                          <span className="text-4xl">{bot.avatar}</span>
                        </motion.div>
                      </motion.div>
                      
                      <motion.h3 
                        className="text-2xl font-medium mb-3 text-white group-hover:gradient-text transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {bot.name}
                      </motion.h3>
                    </div>

                    {/* Bot Description */}
                    <motion.p 
                      className="text-white text-center mb-6 leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + 0.1 * index }}
                    >
                      {bot.description}
                    </motion.p>

                    {/* Capabilities */}
                    <div className="mb-8 relative z-10">
                      <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide text-center">
                        Key Capabilities
                      </h4>
                      <div className="space-y-3">
                        {bot.capabilities.map((capability, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -30, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ 
                              delay: 0.5 + 0.1 * index + 0.1 * idx,
                              type: "spring",
                              stiffness: 100,
                              damping: 10
                            }}
                            whileHover={{ x: 5, scale: 1.05 }}
                            className="flex items-center space-x-3 text-sm group cursor-pointer"
                          >
                            <motion.div 
                              className={`w-2 h-2 rounded-full bg-gradient-to-r ${bot.gradient}`}
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                delay: idx * 0.3,
                              }}
                            />
                            <span className="text-white group-hover:text-gray-200 transition-colors">{capability}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Interact Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + 0.1 * index }}
                      className="relative z-10"
                    >
                      <Link
                        to={`/chat/${bot.id}`}
                        className={`w-full bg-gradient-to-r ${bot.gradient} hover:scale-105 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 group-hover:neon-glow`}
                      >
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                        <span>Interact</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <PlayIcon className="w-4 h-4" />
                        </motion.div>
                      </Link>
                    </motion.div>

                    {/* Enhanced Floating Elements */}
                    <motion.div 
                      className="absolute top-4 right-4 w-3 h-3 bg-neon-purple rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                      animate={{ 
                        scale: [1, 1.4, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1.5, opacity: 1 }}
                    />
                    
                    {/* Card Number Indicator */}
                    <motion.div
                      className={`absolute top-3 left-3 w-6 h-6 rounded-full bg-gradient-to-r ${bot.gradient} flex items-center justify-center text-white text-xs font-bold opacity-80`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.6 + 0.1 * index,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                    >
                      {index + 1}
                    </motion.div>

                    {/* Online Status */}
                    <div className="absolute top-4 right-12 w-3 h-3 bg-neon-green rounded-full animate-pulse opacity-80"></div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Features Overview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex flex-col items-center justify-center">
                <PresentationChartLineIcon className="w-12 h-12 text-neon-purple mx-auto mb-4 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
              <h3 className="text-lg font-medium mb-2 group-hover:gradient-text transition-all duration-300">Data Visualization</h3>
              <p className="text-gray-400 group-hover:text-white transition-colors">Interactive dashboards and advanced analytics visualization</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              >
                <div className="flex flex-col items-center justify-center">
                  <BeakerIcon className="w-12 h-12 text-neon-blue mx-auto mb-4 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
              <h3 className="text-lg font-medium mb-2 group-hover:gradient-text transition-all duration-300">Machine Learning</h3>
              <p className="text-gray-400 group-hover:text-white transition-colors">Predictive models and AI-driven intelligent insights</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex flex-col items-center justify-center">
                <CircleStackIcon className="w-12 h-12 text-neon-green mx-auto mb-4 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
              <h3 className="text-lg font-medium mb-2 group-hover:gradient-text transition-all duration-300">Business Intelligence</h3>
              <p className="text-gray-400 group-hover:text-white transition-colors">Strategic insights and data-driven decision making</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage; 