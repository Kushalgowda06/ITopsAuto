import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CommandLineIcon,
  ChartBarIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon
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
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <EyeIcon className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            {/* Edit Profile */}
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
              <PencilIcon className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            {/* Change Password */}
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-white hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
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

const Dashboard = () => {
  const { user, logout } = useAuth();

  const dashboardCards = [
    {
      id: 'itops',
      title: 'ITOps',
      description: 'Intelligent IT operations with automated incident response, service management, and knowledge assistance',
      icon: ShieldCheckIcon,
      gradient: 'from-neon-green to-royal-800',
      path: '/itops',
      features: [],
      bgPattern: 'security'
    },

    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Advanced data analytics, machine learning, and business intelligence',
      icon: ChartBarIcon,
      gradient: 'from-neon-purple to-royal-600',
      // path: '/analytics',
      path: '/dashboard',
      features: [],
      bgPattern: 'chart'
    },
    {
      id: 'worknext',
      title: 'WorkNext',
      description: 'Next-generation workplace productivity and collaboration tools',
      icon: BriefcaseIcon,
      gradient: 'from-neon-pink to-royal-700',
      // path: '/worknext',
      path: '/dashboard',
      features: [],
      bgPattern: 'productivity'
    },
    {
      id: 'devops',
      title: 'DevOps & IAC',
      description: 'Infrastructure automation, CI/CD pipelines, and deployment orchestration',
      icon: CommandLineIcon,
      gradient: 'from-neon-blue to-royal-500',
      // path: '/devops',
      path: '/dashboard',
      features: [],
      bgPattern: 'terminal'
    }
    
  ];

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
        className="bg-light-900/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-14 h-14 flex-shrink-0">
                {/* <img 
                  src="/cognizant-logo.png" 
                  alt="  Logo" 
                  className="w-full h-full object-contain"
                /> */}
              </div>
              <div className="flex-1 min-w-0">
                                  <h1 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white tracking-wide leading-tight">
                  <span className="block sm:inline"></span>
    
                </h1>
              </div>
            </div>

            {/* Profile Dropdown */}
            <ProfileDropdown user={user} logout={logout} />
          </div>
        </div>
      </motion.header>

      {/* Enhanced Hero Section with Motion Background */}
      <section className="py-16 px-6 relative overflow-hidden">
        {/* Animated Motion Background */}
        <div className="absolute inset-0">
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-blue rounded-full opacity-30"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          
          {/* Gradient waves */}
          <motion.div
            className="absolute inset-0 neural-bg opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
          
          {/* Pulsing circles */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-purple/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-24 h-24 bg-neon-blue/10 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
              style={{
                textShadow: '0 0 40px rgba(255,255,255,0.1)',
                filter: 'drop-shadow(0 0 20px rgba(79, 70, 229, 0.3))'
              }}
            >
              <span className="block mb-2 text-white text-center">Transform Your ITOps with</span>
              <span className="text-white text-6xl md:text-8xl lg:text-7xl font-black bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent block text-center">
                Autonomous ITOps Toolkit
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-white mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Harness the power of artificial intelligence to automate workflows, optimize operations, and drive unprecedented growth across your entire organization.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex items-center justify-center space-x-2 text-neon-blue"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="w-6 h-6" />
              </motion.div>
              <span className="text-lg font-medium">Choose your AI Agent</span>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Single Row Cards with Animated Effects */}
          <div className="relative w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 justify-items-center"
            >
            {dashboardCards.map((card, index) => (
              <motion.div
                key={card.id}
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
                    boxShadow: '0 25px 50px rgba(79, 70, 229, 0.4)',
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative perspective-1000"
              >
                <Link to={card.path}>
                    <motion.div 
                      className="glass-card p-8 h-full relative overflow-hidden transition-all duration-500 group-hover:neon-glow preserve-3d hover:bg-white/15"
                      whileHover={{ rotateX: 2, y: -4 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Dynamic Background Gradient */}
                      <motion.div 
                        className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}
                        initial={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                      />
                      
                      {/* Enhanced Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="shimmer-effect w-full h-full"></div>
                      </div>

                      {/* Multi-layered Glowing Border */}
                      <motion.div 
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1 }}
                      >
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${card.gradient} p-[1px]`}>
                          <div className="w-full h-full bg-dark-900/95 rounded-xl"></div>
                        </div>
                      </motion.div>

                      {/* Subtle Background Elements */}
                      <div className="absolute top-6 right-6 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                      <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/15 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />

                    {/* Card Header */}
                    <div className="flex items-center justify-center mb-8 relative z-10">
                        <motion.div 
                          className={`w-20 h-20 bg-gradient-to-br ${card.gradient} rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:shadow-xl`}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2 * index, type: "spring", stiffness: 200, damping: 15 }}
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          style={{
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          }}
                        >

                          
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 * index, type: "spring", stiffness: 300 }}
                            className="relative z-10"
                          >
                            <card.icon className="w-10 h-10 text-white drop-shadow-lg" />
                          </motion.div>
                        </motion.div>
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 text-center">
                        <motion.h3 
                          className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-gray-100 group-hover:to-white group-hover:bg-clip-text transition-all duration-500 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + 0.1 * index }}
                          whileHover={{ scale: 1.02 }}
                          style={{
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                         {card.title}
                        </motion.h3>
                        
                        <motion.p 
                          className="text-white group-hover:text-gray-200 mb-6 leading-relaxed text-sm text-center transition-all duration-500"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + 0.1 * index }}
                          style={{
                            lineHeight: '1.6'
                          }}
                        >
                        {card.description}
                        </motion.p>

                      {/* Features List */}
                      <div className="space-y-3 mb-8 flex flex-col items-center">
                          {card.features.slice(0, 3).map((feature, idx) => (
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
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center justify-center space-x-3 text-sm group cursor-pointer bg-white/3 hover:bg-white/6 rounded-lg px-3 py-2 border border-white/8 hover:border-white/15 transition-all duration-300"
                            >
                              <motion.div 
                                className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.gradient} shadow-lg`}
                                animate={{
                                  opacity: [0.6, 0.9, 0.6],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  delay: idx * 0.5,
                                }}
                              />
                              <span className="text-white group-hover:text-white transition-colors duration-300 font-medium">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                        {/* Enhanced Action Button */}
                        <motion.div 
                          className="flex flex-col items-center justify-center text-center space-y-3 mt-auto"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 + 0.1 * index }}
                        >
                          <motion.span 
                            className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300 uppercase tracking-wider font-medium"
                            whileHover={{ scale: 1.05 }}
                          >
                          Explore Agentic Network
                          </motion.span>
                          
                          {/* <motion.div 
                            className={`flex items-center justify-center space-x-2 text-white bg-gradient-to-r ${card.gradient} px-5 py-2.5 rounded-lg opacity-0 group-hover:opacity-90 transition-all duration-400 shadow-md hover:shadow-lg`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ y: 5 }}
                            animate={{ y: 0 }}
                          >
                            <span className="text-sm font-medium">Launch</span>
                            <ArrowRightIcon className="w-4 h-4" />
                          </motion.div> */}
                        </motion.div>
                      </div>

                      {/* Card Number Indicator */}
                      <motion.div
                        className={`absolute top-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white text-sm font-bold opacity-90 shadow-lg`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.6 + 0.1 * index,
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        style={{
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {index + 1}
                      </motion.div>
                    </motion.div>
                </Link>
              </motion.div>
            ))}
            </motion.div>

            {/* Animated Floating Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-neon-blue/20 rounded-full"
                  animate={{
                    x: [0, Math.random() * 200 - 100],
                    y: [0, Math.random() * 200 - 100],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: Math.random() * 4 + 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>


          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      {/* <section className="py-12 px-6 bg-dark-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
                         <h3 className="text-2xl font-medium gradient-text mb-2">
               AI Operations Overview
             </h3>
            <p className="text-gray-400">Real-time insights into your AI-powered operations</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Bots', value: '12', change: '+3' },
              { label: 'Tasks Automated', value: '1,247', change: '+156' },
              { label: 'Time Saved', value: '342h', change: '+42h' },
              { label: 'Efficiency Gain', value: '85%', change: '+12%' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center group hover:neon-glow transition-all duration-300 flex flex-col items-center justify-center"
              >
                <div className="text-3xl font-medium text-white mb-2 text-center">
                   {stat.value}
                </div>
                <div className="text-gray-400 mb-2 text-center">{stat.label}</div>
                <div className="text-neon-green text-sm font-medium text-center">
                  {stat.change} this week
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
                              Autonomous IT Operations Toolkit - Powered by next-generation artificial intelligence
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Dashboard; 