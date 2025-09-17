import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronLeftIcon,
  CogIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon
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
                {copied ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
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

const ChangeGeneratePage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [formData, setFormData] = useState({
    changeType: '',
    shortDescription: '',
    description: '',
    changeImpact: '',
    implementationPlan: '',
    rollbackPlan: '',
    validationPlan: ''
  });

  const initialFormData = location.state?.formData;

  useEffect(() => {
    if (!initialFormData) {
      navigate('/change-assist');
      return;
    }

    // Simulate AI generation process
    const generateChangeRequest = async () => {
      setIsGenerating(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Auto-populate form fields based on initial data
      setFormData({
        changeType: 'normal',
        shortDescription: `${initialFormData.changeName} - ${initialFormData.configurationItem}`,
        description: initialFormData.changeReason,
        changeImpact: `Medium impact on ${initialFormData.configurationItem} and related services. Expected downtime: 30 minutes during implementation window.`,
        implementationPlan: `1. Pre-Change Activities:
   - Backup current configuration of ${initialFormData.configurationItem}
   - Verify system resources and dependencies
   - Schedule maintenance window
   - Notify stakeholders

2. Change Implementation:
   - Stop dependent services if required
   - Apply changes to ${initialFormData.configurationItem}
   - Update ${initialFormData.operatingSystem} configurations
   - Restart services and verify functionality

3. Post-Change Validation:
   - Conduct functional testing
   - Validate performance metrics
   - Update configuration management database
   - Document completion`,
        rollbackPlan: `1. Immediate Actions:
   - Stop all change activities
   - Restore from backup configuration
   - Restart ${initialFormData.configurationItem} services
   - Verify system functionality

2. Verification:
   - Confirm services are operational
   - Check dependent systems
   - Notify stakeholders of rollback
   - Document rollback reason

3. Post-Rollback:
   - Investigate root cause
   - Update change plan if needed
   - Reschedule implementation
   - Update stakeholders`,
        validationPlan: `1. Pre-Implementation Validation:
   - Verify all prerequisites are met
   - Confirm backup completion
   - Check system resources
   - Validate maintenance window

2. During Implementation:
   - Monitor system performance
   - Check service availability
   - Validate configuration changes
   - Monitor error logs

3. Post-Implementation:
   - Functional testing of ${initialFormData.configurationItem}
   - Integration testing with dependent systems
   - Performance validation
   - User acceptance testing
   - Update documentation`
      });

      setIsGenerating(false);
      setShowForm(true);
    };

    generateChangeRequest();
  }, [initialFormData, navigate, user]);



  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmitChange = () => {
    // Here you would typically submit to ServiceNow API
    console.log('Submitting change request:', formData);
    console.log('Uploaded file:', uploadedFile);
    
    // Show success message and redirect
    alert('Change request submitted successfully!');
    navigate('/itops');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      navigate('/change-assist');
    }
  };

  if (!initialFormData) {
    return null;
  }

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
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link 
                to="/change-assist"
                className="flex items-center space-x-2 text-white hover:text-white transition-colors duration-300 group"
              >
                <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Form</span>
              </Link>
              
              <div className="h-6 border-l border-gray-600"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-royal-800 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Change Request Details</h1>
                  <p className="text-sm text-gray-400">Review and finalize your change request</p>
                </div>
              </div>
            </div>

            <ProfileDropdown user={user} logout={logout} />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-green to-royal-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Change Request Details</h2>
              <p className="text-gray-200 text-sm mt-1">Review and finalize change information</p>
            </div>
            
            {/* Upload Architecture Button */}
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-300 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span>Upload Architecture</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
                />
              </label>
              {uploadedFile && (
                <span className="text-sm text-white">
                  ✓ {uploadedFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-green"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <DocumentTextIcon className="w-8 h-8 text-neon-green" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Generating Change Request</h3>
                  <p className="text-white">AI is creating comprehensive documentation...</p>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : showForm ? (
              <form className="space-y-6">
                {/* Change Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Change Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.changeType}
                    onChange={(e) => handleInputChange('changeType', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white"
                  >
                    <option value="">Select Change Type</option>
                    <option value="normal">Normal</option>
                    <option value="standard">Standard</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Short Description <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Brief summary of the change"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Detailed description of the change"
                  />
                </div>

                {/* Change Impact */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Change Impact <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.changeImpact}
                    onChange={(e) => handleInputChange('changeImpact', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Describe the expected impact of this change"
                  />
                </div>

                {/* Change Implementation Plan */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Change Implementation Plan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={formData.implementationPlan}
                    onChange={(e) => handleInputChange('implementationPlan', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Step-by-step implementation plan"
                  />
                </div>

                {/* Change Rollback Plan */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Change Rollback Plan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.rollbackPlan}
                    onChange={(e) => handleInputChange('rollbackPlan', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Plan for rolling back changes if needed"
                  />
                </div>

                {/* Change Validation Plan */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Change Validation Plan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={formData.validationPlan}
                    onChange={(e) => handleInputChange('validationPlan', e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Plan for validating the change was successful"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-white/20">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-white hover:text-white rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitChange}
                    className="px-8 py-3 bg-gradient-to-r from-neon-green to-royal-800 hover:from-neon-green/90 hover:to-royal-800/90 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Submit Change Request
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChangeGeneratePage; 