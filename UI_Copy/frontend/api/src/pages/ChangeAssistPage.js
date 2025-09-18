import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
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
  ArrowRightIcon,
  DocumentTextIcon
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

const ChangeAssistPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [detailsFormData, setDetailsFormData] = useState({});
  const [dynamicFormFields, setDynamicFormFields] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [changeRequestNumber, setChangeRequestNumber] = useState('');
  const [changeRequestLink, setChangeRequestLink] = useState('');
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const [originalFormData, setOriginalFormData] = useState({});

  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    mode: 'onChange'
  });

  const operatingSystems = [
    'Windows 10',
    'Windows 11',
    'Windows Server 2019',
    'Windows Server 2022',
    'Ubuntu 20.04 LTS',
    'Ubuntu 22.04 LTS',
    'RHEL 8',
    'RHEL 9',
    'CentOS 7',
    'CentOS 8',
    'Debian 11',
    'Debian 12',
    'SUSE Linux Enterprise',
    'macOS',
    'Other'
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Store original form data for later use
    setOriginalFormData(data);
    
    try {
      // Create request body as specified
      const requestBody = {
        change_title: data.changeName,
        change_purpose: data.purposeOfChange,
        os_info: data.operatingSystem || "", // Leave blank if not filled
        uploaded_files: uploadedFile ? uploadedFile.name : "", // Use uploaded file name or leave blank
        config_items: data.configurationItem
      };

      // Make API call
      const response = await fetch('http://172.31.6.97:6500/change_management/api/v1/draft_change_prompt/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiData = await response.json();
      setApiResponse(apiData);

      // Parse change_details from the API response
      if (apiData.output && apiData.output.data && apiData.output.data.change_details) {
        const changeDetails = apiData.output.data.change_details;
        const impactAnalysis = apiData.output.data.impact_analysis;
        
        // Create dynamic form fields based on API response keys
        const fields = Object.keys(changeDetails).map(key => ({
          key: key,
          label: formatLabel(key),
          value: changeDetails[key],
          type: getFieldType(key, changeDetails[key])
        }));
        
        // Add Impact Analysis field if it exists in the response
        if (impactAnalysis) {
          fields.push({
            key: 'impact_analysis',
            label: 'Impact Analysis',
            value: impactAnalysis,
            type: getFieldType('impact_analysis', impactAnalysis)
          });
        }
        
        setDynamicFormFields(fields);
        
        // Initialize form data with API response values
        const initialFormData = {};
        fields.forEach(field => {
          initialFormData[field.key] = field.value;
        });
        setDetailsFormData(initialFormData);
        
        setShowDetailsForm(true);
      } else {
        console.error('Invalid API response structure:', apiData);
        // Fallback to original static form if API response is invalid
        setDetailsFormData({
          changeType: '',
          shortDescription: '',
          description: '',
          changeImpact: '',
          implementationPlan: '',
          rollbackPlan: '',
          validationPlan: ''
        });
        setShowDetailsForm(true);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Fallback: show form with empty values if API fails
      setDetailsFormData({
        changeType: '',
        shortDescription: '',
        description: '',
        changeImpact: '',
        implementationPlan: '',
        rollbackPlan: '',
        validationPlan: ''
      });
    setShowDetailsForm(true);
    } finally {
    setIsSubmitting(false);
    }
  };

  // Helper function to format field labels
  const formatLabel = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to determine field type based on content
  const getFieldType = (key, value) => {
    if (key === 'chg_model' || key === 'change_model') {
      return 'select';
    }
    if (typeof value === 'string' && value.length > 100) {
      return 'textarea';
    }
    return 'input';
  };

  // Helper function to get select options
  const getSelectOptions = (key, value) => {
    if (key === 'chg_model' || key === 'change_model') {
      return ['normal', 'standard', 'emergency'];
    }
    return [];
  };

  const handleDetailsInputChange = (field, value) => {
    setDetailsFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, JPEG)');
        return;
      }
      
      setUploadedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null);
  };

  const handleSubmitChange = async () => {
    setIsSubmittingChange(true);
    
    try {
      // Map form field values to API request structure
      const changeData = {
        short_description: detailsFormData.short_description || '',
        description: detailsFormData.description || '',
        implementation_plan: detailsFormData.implementation_plan || detailsFormData.test_plan || '',
        backout_plan: detailsFormData.backout_plan || '',
        test_plan: detailsFormData.test_plan || detailsFormData.implementation_plan || '',
        chg_model: detailsFormData.chg_model || detailsFormData.change_model || 'normal',
        risk_impact_analysis: detailsFormData.impact_analysis || ''
      };

      // Create request body
      const requestBody = {
        uploaded_files: "Network.png", // Static for now as requested
        config_items: originalFormData.configurationItem || '',
        change: changeData
      };

      console.log('Submitting change request:', requestBody);

      // Make API call
      const response = await fetch('http://172.31.6.97:6500/change_management/api/v1/create_change_with_impact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Change request response:', responseData);

      // Extract change request number and link from response
      const changeNumber = responseData.output?.data?.change_number || 'CHG0000001';
      const changeLink = responseData.output?.data?.change_link || '';
      
      setChangeRequestNumber(changeNumber);
      setChangeRequestLink(changeLink);
      setShowSuccessPopup(true);

    } catch (error) {
      console.error('Error submitting change request:', error);
      // You can add error handling here (show error popup, etc.)
      alert('Error submitting change request. Please try again.');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  const handleCancel = () => {
    setShowDetailsForm(false);
    setDetailsFormData({});
    setDynamicFormFields([]);
    setApiResponse(null);
  };

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
            {/* Left side - Back button and Page Title */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/itops"
                className="p-2 glass-button rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-royal-800 rounded-xl flex items-center justify-center">
                  <CogIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-medium text-white">Change Assist</h1>
                  <p className="text-xs text-gray-400">ServiceNow Change Request Generator</p>
                </div>
              </div>
            </div>

            {/* Right side - Company Name and Profile */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8">
                  <img 
                    src="/cognizant-logo.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-white text-lg">  Autonomous IT Operations Toolkit</span>
            </div>

            <ProfileDropdown user={user} logout={logout} />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Left Column - Change Assist Form (50%) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`${showDetailsForm ? 'w-1/2' : 'w-full'} bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl transition-all duration-700 ease-in-out`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-green to-royal-800 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Create Change Request</h2>
              <p className="text-gray-200 text-sm mt-1">Fill in the details below to generate a comprehensive ServiceNow change request</p>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-full flex flex-col">
                                 <div className="flex-1 space-y-6 pr-2">
                {/* Name of the Change */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name of the Change <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('changeName', { required: 'Change name is required' })}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Enter a descriptive name for your change request"
                  />
                  {errors.changeName && (
                    <p className="mt-1 text-sm text-red-400">{errors.changeName.message}</p>
                  )}
                </div>

                {/* Purpose of the Change */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Purpose of the Change <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    {...register('purposeOfChange', { required: 'Purpose is required' })}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Describe the purpose, business justification, and expected benefits of this change"
                  />
                  {errors.purposeOfChange && (
                    <p className="mt-1 text-sm text-red-400">{errors.purposeOfChange.message}</p>
                  )}
                </div>

                {/* Configuration Item */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Configuration Item <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('configurationItem', { required: 'Configuration item is required' })}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                    placeholder="Specify the system, application, or infrastructure component affected"
                  />
                  {errors.configurationItem && (
                    <p className="mt-1 text-sm text-red-400">{errors.configurationItem.message}</p>
                  )}
                </div>

                {/* Operating System */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Operating System <span className="text-gray-500">(Optional)</span>
                  </label>
                  <select
                    {...register('operatingSystem')}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white"
                  >
                    <option value="">Select Operating System</option>
                    {operatingSystems.map((os) => (
                      <option key={os} value={os} className="bg-dark-800 text-white">{os}</option>
                    ))}
                  </select>
                </div>

                {/* Image Upload (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Image <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center justify-center w-full px-4 py-6 bg-dark-800/50 border-2 border-dashed border-white/20 rounded-lg hover:border-neon-green/50 transition-colors duration-300 cursor-pointer group">
                      <div className="text-center">
                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-neon-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="text-sm text-gray-400 group-hover:text-neon-green transition-colors">
                          Click to upload an image or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        className="hidden"
                        accept=".png,.jpg,.jpeg"
                      />
                    </label>
                    
                    {/* Image Preview */}
                    {uploadedFile && uploadedFile.type.startsWith('image/') && (
                      <div className="relative">
                        <img 
                          src={URL.createObjectURL(uploadedFile)} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        <div className="mt-2 text-sm text-gray-300">
                          ✓ {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-neon-green to-royal-800 hover:from-neon-green/90 hover:to-royal-800/90 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Change</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Change Request Details Form (50%) */}
          {showDetailsForm && (
          <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-1/2 bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-neon-green to-royal-800 px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-white">Change Request Details</h2>
                <p className="text-gray-200 text-sm mt-1">Review and finalize change information</p>
              </div>
            </div>

            {/* Form */}
              <div className="p-6 overflow-y-auto h-[calc(100%-140px)]">
                <form className="space-y-6 flex flex-col">
                  <div className="flex-1 space-y-6  pr-2">
                    {dynamicFormFields.map((field, index) => (
                      <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                          {field.label} <span className="text-red-400">*</span>
                  </label>
                        {field.type === 'input' ? (
                  <input
                    type="text"
                            value={detailsFormData[field.key] || ''}
                            onChange={(e) => handleDetailsInputChange(field.key, e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                            placeholder={`Enter ${field.label}`}
                          />
                        ) : field.type === 'textarea' ? (
                  <textarea
                    rows={4}
                            value={detailsFormData[field.key] || ''}
                            onChange={(e) => handleDetailsInputChange(field.key, e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white placeholder-gray-400"
                            placeholder={`Enter ${field.label}`}
                          />
                                                 ) : (
                           <select
                             value={detailsFormData[field.key] || ''}
                             onChange={(e) => handleDetailsInputChange(field.key, e.target.value)}
                             className="w-full px-4 py-3 bg-dark-800/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-neon-green outline-none text-white"
                           >
                             <option value="">Select {field.label}</option>
                             {getSelectOptions(field.key, field.value).map(option => (
                               <option key={option} value={option} className="bg-dark-800 text-white">
                                 {option.charAt(0).toUpperCase() + option.slice(1)}
                               </option>
                             ))}
                           </select>
                         )}
                </div>
                    ))}
                </div>

                {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 font-medium rounded-lg transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitChange}
                    disabled={isSubmittingChange}
                    className="px-8 py-3 bg-gradient-to-r from-neon-green to-royal-800 hover:from-neon-green/90 hover:to-royal-800/90 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmittingChange ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Change Request</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
          )}
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-dark-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Success Icon */}
            <div className="flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Change Request Submitted Successfully!
            </h3>
            
            {/* Change Request Number */}
            <div className="bg-dark-800/50 border border-white/10 rounded-lg p-4 mb-6">
              <p className="text-gray-400 text-sm text-center mb-1">Change Request Number</p>
              <p className="text-neon-green text-lg font-bold text-center font-mono">
                {changeRequestNumber}
              </p>
            </div>
            
            {/* Message */}
            <p className="text-gray-300 text-center mb-4">
              Your change request has been created and submitted for approval. You can track its progress in the ITSM system.
            </p>

            {/* Change Link Button */}
            {changeRequestLink && (
              <div className="mb-6">
                <a
                  href={changeRequestLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 hover:text-blue-300 font-medium rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  <span>View Change Request</span>
                </a>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  // Reset success popup and details form states
                  setShowSuccessPopup(false);
                  setShowDetailsForm(false);
                  setDetailsFormData({});
                  setDynamicFormFields([]);
                  setApiResponse(null);
                  setOriginalFormData({});
                  setChangeRequestNumber('');
                  setChangeRequestLink('');
                  
                  // Reset the Create Change Request form
                  reset();
                  
                  // Clear uploaded image
                  setUploadedFile(null);
                  
                  // Reset submission states
                  setIsSubmitting(false);
                  setIsSubmittingChange(false);
                }}
                className="flex-1 px-4 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 font-medium rounded-lg transition-colors duration-300"
              >
                Create Another
              </button>
              <button
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate('/itops');
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-green to-royal-800 hover:from-neon-green/90 hover:to-royal-800/90 text-white font-medium rounded-lg transition-all duration-300"
              >
                Back to ITOps
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ChangeAssistPage; 