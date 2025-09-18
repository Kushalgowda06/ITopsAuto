import React, { useState, useEffect } from 'react';
import { Container, Form, InputGroup, Button } from 'react-bootstrap';
import { 
  HiLightBulb, 
  HiShieldCheck, 
  HiExclamationTriangle,
  HiUser,
  HiLockClosed,
  HiArrowRightOnRectangle,
  HiSparkles,
  HiRocketLaunch,
  HiGlobeAlt,
  HiCog6Tooth,
  HiEye,
  HiEyeSlash
} from 'react-icons/hi2';
import { HiInformationCircle } from 'react-icons/hi';
import { LuBrain } from "react-icons/lu";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [validated, setValidated] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const validateField = (name, value) => {
    let error = '';
    
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else if (name === 'username' && value.trim().length < 3) {
      error = 'Username must be at least 3 characters';
    } else if (name === 'password' && value.length < 4) {
      error = 'Password must be at least 4 characters';
    }
    
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateForm = () => {
    const usernameError = validateField('username', credentials.username);
    const passwordError = validateField('password', credentials.password);
    
    setFieldErrors({
      username: usernameError,
      password: passwordError
    });
    
    return !usernameError && !passwordError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    
    // Validate form
    if (!validateForm()) {
      setError('Please correct the errors below');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        onLogin();
      } else {
        setError('Invalid credentials! Use username: admin, password: admin');
        setFieldErrors({
          username: credentials.username !== 'admin' ? 'Incorrect username' : '',
          password: credentials.password !== 'admin' ? 'Incorrect password' : ''
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modern-login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>

      <Container fluid className="h-100 w-100">
        <div className={`modern-login-wrapper ${isVisible ? 'visible' : ''}`}>
          
          {/* Left Brand Section */}
          <div className="modern-brand-section">
            <div className="brand-content">
              {/* Animated Logo */}
              <div className="animated-logo">
                <div className="logo-ring ring-1"></div>
                <div className="logo-ring ring-2"></div>
                <div className="logo-ring ring-3"></div>
                <LuBrain  className="main-logo-icon" />
                <HiSparkles className="sparkle sparkle-1" />
                <HiSparkles className="sparkle sparkle-2" />
                <HiSparkles className="sparkle sparkle-3" />
              </div>
              
              {/* Brand Text */}
              <div className="brand-text">
                <h1 className="brand-title">
                  <span className="title-word word-1">Knowledge</span>
                  <span className="title-word word-2">Curation</span>
                </h1>
                <p className="brand-tagline">
                  Transform your IT operations with intelligent documentation
                </p>
              </div>

              {/* Animated Features */}
              <div className="feature-showcase">
                <div className="feature-item" style={{ '--delay': '0.2s' }}>
                  <div className="feature-icon">
                    <HiShieldCheck />
                  </div>
                  <div className="feature-text">
                    <strong>Enterprise Security</strong>
                    <span>Bank-level encryption & access control</span>
                  </div>
                </div>
                
                <div className="feature-item" style={{ '--delay': '0.4s' }}>
                  <div className="feature-icon">
                    <HiRocketLaunch />
                  </div>
                  <div className="feature-text">
                    <strong>Lightning Fast</strong>
                    <span>AI-powered search & instant results</span>
                  </div>
                </div>
                
                <div className="feature-item" style={{ '--delay': '0.6s' }}>
                  <div className="feature-icon">
                    <HiGlobeAlt />
                  </div>
                  <div className="feature-text">
                    <strong>Global Access</strong>
                    <span>Multi-platform & cloud synchronization</span>
                  </div>
                </div>
                
                <div className="feature-item" style={{ '--delay': '0.8s' }}>
                  <div className="feature-icon">
                    <HiCog6Tooth />
                  </div>
                  <div className="feature-text">
                    <strong>Smart Automation</strong>
                    <span>Intelligent workflows & auto-updates</span>
                  </div>
                </div>
              </div>

              {/* Stats Counter */}
              <div className="stats-section">
                <div className="stat">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">SOPs</span>
                </div>
                <div className="stat">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Teams</span>
                </div>
                <div className="stat">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Login Section */}
          <div className="modern-form-section">
            <div className="form-container">
              {/* Header */}
              <div className="form-header">
                {/* Company Logo */}
                <div className="company-logo-section" style={{ 
                  textAlign: 'center', 
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <img 
                    src="/assets/cts_logo_full.svg" 
                    alt="Company Logo"
                    style={{ 
                      height: '50px',
                      width: 'auto',
                      objectFit: 'contain',
                      marginBottom: '0.75rem',
                      maxWidth: '240px'
                    }}
                  />
                  <h2 style={{
                    color: '#333',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: '0',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}>
                    Welcome
                  </h2>
                </div>
                <p className="welcome-subtitle">
                  Sign in to access your intelligent knowledge hub
                </p>
              </div>

              {/* Login Form */}
              <Form className="modern-form" onSubmit={handleSubmit} noValidate>
                {error && (
                  <div className="error-alert">
                    <HiExclamationTriangle className="error-icon" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Username Field */}
                <Form.Group className="mb-4">
                  <Form.Label>Username</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <HiUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      required
                      disabled={isLoading}
                      size="lg"
                      isInvalid={!!fieldErrors.username && validated}
                      isValid={!fieldErrors.username && validated && credentials.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.username}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text>
                      <HiLockClosed />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      required
                      disabled={isLoading}
                      size="sm"
                      isInvalid={!!fieldErrors.password && validated}
                      isValid={!fieldErrors.password && validated && credentials.password}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                      style={{ borderLeft: 'none' }}
                    >
                      {showPassword ? <HiEyeSlash /> : <HiEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`modern-submit-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  <div className="btn-content">
                    {isLoading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <HiArrowRightOnRectangle className="btn-icon" />
                        <span>Access Dashboard</span>
                      </>
                    )}
                  </div>
                  <div className="btn-glow"></div>
                </button>
              </Form>

              {/* Footer Info */}
              <div className="form-footer">
                <div className="demo-info">
                  <HiInformationCircle className="info-icon" />
                  <div>
                    <strong>Demo Access:</strong>
                    <span>Username: <code>admin</code> | Password: <code>admin</code></span>
                  </div>
                </div>
                
                <div className="security-badge">
                  <HiShieldCheck className="security-icon" />
                  <span>Protected by 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login; 