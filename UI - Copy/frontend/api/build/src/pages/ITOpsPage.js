import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const ITOpsPage = () => {
  // NextGen ITOps specific bots
  const itOpsBots = [
    {
      id: 'knowledge-assist',
      name: 'Knowledge Assist',
      description: 'Intelligent knowledge management and retrieval system for IT operations with advanced learning capabilities.',
      avatar: '📚',
      gradient: 'from-neon-green to-royal-800',
      capabilities: [
        'Knowledge Base Management',
        'Intelligent Information Retrieval',
        'Learning & Documentation',
        'Expertise Sharing & Support'
      ]
    },
    {
      id: 'change-assist',
      name: 'Change Assist',
      description: 'Manages IT changes, tracks deployments, and ensures smooth operational transitions with intelligent risk assessment.',
      avatar: '🔄',
      gradient: 'from-neon-green to-royal-800',
      capabilities: [
        'Change Management & Planning',
        'Risk Assessment & Analysis',
        'Deployment Tracking & Monitoring',
        'Impact Analysis & Reporting'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-900 text-white">
      {/* Header */}
      <header className="bg-light-900/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard"
                className="p-2 glass-button rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-royal-800 rounded-xl flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-medium">ITOps</h1>
                  <p className="text-sm text-gray-400">Security & Operations AI</p>
                </div>
              </div>
            </div>

            <Link to="/dashboard" className="flex items-center space-x-2">
                              <div className="w-6 h-6">
                  <img 
                    src="/cognizant-logo.png" 
                    alt="Cognizant" 
                    className="w-full h-full object-contain"
                  />
                </div>
              <span className="font-medium text-white">Autonomous IT Operations Toolkit</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Motion Background */}
      <section className="py-16 px-6 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Floating security elements */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-neon-green/20 text-2xl"
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.6, 0.2],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 12 + 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                {['🛡️', '🔒', '⚡', '🔧', '📊', '🎯', '⚙️', '🚨'][Math.floor(Math.random() * 8)]}
              </motion.div>
            ))}
          </div>
          
          {/* Gradient security waves */}
          <motion.div
            className="absolute inset-0 particle-bg opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 16,
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
                ITOps
              </span>
              <span className="block text-white">
                AI Assistants
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Intelligent IT operations with automated incident response, advanced security monitoring, and smart change management
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex items-center justify-center space-x-2 text-neon-green"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <LightBulbIcon className="w-6 h-6" />
              </motion.div>
              <span className="text-lg font-medium">Choose your ITOps AI specialist</span>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <LightBulbIcon className="w-6 h-6" />
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
              {itOpsBots.map((bot, index) => (
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
                    boxShadow: '0 25px 50px rgba(34, 197, 94, 0.4)',
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
                      className="text-gray-300 text-center mb-6 leading-relaxed"
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
                            <span className="text-gray-300 group-hover:text-gray-200 transition-colors">{capability}</span>
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
                      {/* <Link
                        to={`http://localhost:3001/`}
                        className={`w-full bg-gradient-to-r ${bot.gradient} hover:scale-105 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 group-hover:neon-glow`}
                      > */}
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
                      {/* </Link> */}
                    </motion.div>

                    {/* Enhanced Floating Elements */}
                    <motion.div 
                      className="absolute top-4 right-4 w-3 h-3 bg-neon-green rounded-full opacity-0 group-hover:opacity-80 transition-opacity duration-300"
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
                <ExclamationTriangleIcon className="w-12 h-12 text-neon-green mx-auto mb-4 group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2 group-hover:gradient-text transition-all duration-300">Incident Response</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Automated incident detection and intelligent resolution</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <EyeIcon className="w-12 h-12 text-neon-blue mx-auto mb-4 group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2 group-hover:gradient-text transition-all duration-300">Security Monitoring</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Real-time threat detection and advanced prevention</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowPathIcon className="w-12 h-12 text-neon-purple mx-auto mb-4 group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2 group-hover:gradient-text transition-all duration-300">Change Management</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">Intelligent change planning and risk assessment</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ITOpsPage; 