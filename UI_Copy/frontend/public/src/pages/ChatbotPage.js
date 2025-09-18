import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  XMarkIcon,
  ChevronLeftIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  Bars3Icon,
  CommandLineIcon,
  ChartBarIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PencilIcon,
  KeyIcon,
  CheckIcon,
  UserCircleIcon,
  StopIcon,
  PlayIcon,
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

const ChatbotPage = () => {
  const { botId } = useParams();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentBot, setCurrentBot] = useState(null);
  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [pipelineDetails, setPipelineDetails] = useState({
    pipelineName: '',
    repoName: '',
    environment: '',
    appType: '',
    pipelineTool: '',
    stagesCount: '',
    stages: []
  });
  const [currentPipelineStep, setCurrentPipelineStep] = useState(0);
  const [showInfraForm, setShowInfraForm] = useState(false);
  const [infraDetails, setInfraDetails] = useState({
    resourceName: '',
    cloudPlatform: '',
    resourceType: '',
    additionalDetails: {}
  });
  const [currentInfraStep, setCurrentInfraStep] = useState(0);
  const [showResourceConfigModal, setShowResourceConfigModal] = useState(false);
  const [selectedResourceConfig, setSelectedResourceConfig] = useState(null);
  const [showCostOptForm, setShowCostOptForm] = useState(false);
  const [costOptDetails, setCostOptDetails] = useState({
    cloudPlatform: '',
    optimizationFocus: '',
    savingsGoal: '',
    analysisComplete: false
  });
  const [showUnixPermForm, setShowUnixPermForm] = useState(false);
  const [unixPermDetails, setUnixPermDetails] = useState({
    cloudPlatform: '',
    serverHostname: ''
  });
  const [showChangeAssistForm, setShowChangeAssistForm] = useState(false);
  const [changeAssistDetails, setChangeAssistDetails] = useState({
    ciName: '',
    ciDescription: '',
    operatingSystem: '',
    changeDescription: '',
    changeWindow: '',
    priority: '',
    riskLevel: ''
  });
  const [currentChangeStep, setCurrentChangeStep] = useState(0);
  const [generatedDocuments, setGeneratedDocuments] = useState(null);
  const [showKnowledgeAssistForm, setShowKnowledgeAssistForm] = useState(false);
  const [knowledgeAssistDetails, setKnowledgeAssistDetails] = useState({
    ticketNumber: '',
    ticketType: '',
    category: '',
    priority: ''
  });
  const [knowledgeBaseArticles, setKnowledgeBaseArticles] = useState([]);
  const [showVoiceAIForm, setShowVoiceAIForm] = useState(false);
  const [voiceAIDetails, setVoiceAIDetails] = useState({
    employeeId: '',
    problemStatement: '',
    conversationStage: 'welcome' // welcome, employeeId, problem, solution, complete
  });
  const [isListeningForVoice, setIsListeningForVoice] = useState(false);
  const [voiceRecognition, setVoiceRecognition] = useState(null);
  const [voiceSynthesis, setVoiceSynthesis] = useState(null);
  const [showChatAIForm, setShowChatAIForm] = useState(false);
  const [chatAIDetails, setChatAIDetails] = useState({
    employeeId: '',
    problemStatement: '',
    conversationStage: 'welcome' // welcome, employeeId, problem, solution, complete
  });
  const [showConversationHistory, setShowConversationHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Bot data for all sections
  const allBots = {
    // DevOps & IAC
    'build-automate': {
      id: 'build-automate',
      name: 'Build Automate',
      description: 'Automates build processes, manages CI/CD pipelines, and optimizes deployment workflows',
      avatar: '🛠️',
      gradient: 'from-neon-blue to-royal-500',
      section: 'DevOps & IAC',
      icon: CommandLineIcon,
      capabilities: ['Automated Builds', 'Pipeline Management', 'Deployment Automation', 'Build Optimization']
    },
    'devops-pipeline': {
      id: 'devops-pipeline',
      name: 'DevOps Pipeline Developer',
      description: 'Designs and optimizes DevOps pipelines, infrastructure as code, and deployment strategies',
      avatar: '⚙️',
      gradient: 'from-neon-blue to-royal-500',
      section: 'DevOps & IAC',
      icon: CommandLineIcon,
      capabilities: ['Pipeline Design', 'Infrastructure as Code', 'Deployment Strategy', 'Performance Monitoring']
    },
    // Analytics
    'cost-optimization': {
      id: 'cost-optimization',
      name: 'Cost Optimization Recommendation Agent',
      description: 'Analyzes resource usage and provides intelligent cost optimization recommendations',
      avatar: '💰',
      gradient: 'from-neon-purple to-royal-600',
      section: 'Analytics',
      icon: ChartBarIcon,
      capabilities: ['Cost Analysis', 'Resource Optimization', 'Budget Forecasting', 'Savings Recommendations']
    },
    'unix-permission': {
      id: 'unix-permission',
      name: 'Unix File Permission Agent',
      description: 'Manages Unix file permissions, security policies, and access control optimization',
      avatar: '🔐',
      gradient: 'from-neon-purple to-royal-600',
      section: 'Analytics',
      icon: ChartBarIcon,
      capabilities: ['Permission Management', 'Security Analysis', 'Access Control', 'Compliance Monitoring']
    },
    // WorkNext
    'chat-ai': {
      id: 'chat-ai',
      name: 'Chat AI',
      description: 'Advanced conversational AI for workplace communication and productivity enhancement',
      avatar: '💬',
      gradient: 'from-neon-pink to-royal-700',
      section: 'WorkNext',
      icon: BriefcaseIcon,
      capabilities: ['Natural Conversation', 'Task Assistance', 'Meeting Support', 'Document Analysis']
    },
    'voice-ai': {
      id: 'voice-ai',
      name: 'Voice AI',
      description: 'Voice-enabled AI assistant for hands-free workplace interactions and voice commands',
      avatar: '🎤',
      gradient: 'from-neon-pink to-royal-700',
      section: 'WorkNext',
      icon: BriefcaseIcon,
      capabilities: ['Voice Recognition', 'Speech Synthesis', 'Voice Commands', 'Audio Processing'],
      supportsVoice: true
    },
    // NextGen ITOps
    'knowledge-assist': {
      id: 'knowledge-assist',
      name: 'Knowledge Assist',
      description: 'Intelligent knowledge management and retrieval system for IT operations',
      avatar: '📚',
      gradient: 'from-neon-green to-royal-800',
      section: 'ITOps',
      icon: ShieldCheckIcon,
      capabilities: ['Knowledge Retrieval', 'Documentation', 'Learning Assistance', 'Information Management']
    },
    'change-assist': {
      id: 'change-assist',
      name: 'Change Assist',
      description: 'Manages IT changes, tracks deployments, and ensures smooth operational transitions',
      avatar: '🔄',
      gradient: 'from-neon-green to-royal-800',
      section: 'ITOps',
      icon: ShieldCheckIcon,
      capabilities: ['Change Management', 'Risk Assessment', 'Deployment Tracking', 'Impact Analysis']
    }
  };

  useEffect(() => {
    // Load voices for speech synthesis when component mounts
    if ('speechSynthesis' in window) {
      // Some browsers require a user interaction to load voices
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoiceSynthesis(window.speechSynthesis);
        }
      };
      
      loadVoices();
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + S: Save conversation
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (messages.length > 2) {
          saveConversationToHistory();
          showNotification('Conversation saved to history');
        }
      }
      
      // Ctrl/Cmd + E: Export conversation
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        if (messages.length > 2) {
          exportConversationAsPDF();
          showNotification('Conversation exported');
        }
      }
      
      // Ctrl/Cmd + H: Show conversation history
      if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault();
        setShowConversationHistory(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages]);

  const showNotification = (message) => {
    // Simple notification system
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'fixed top-4 right-4 bg-neon-blue/90 text-white px-4 py-2 rounded-lg z-50 transition-all duration-300';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 2000);
  };

  // Load conversation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatbot_conversation_history');
    if (savedHistory) {
      setConversationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save conversation to history when bot changes or conversation ends
  const saveConversationToHistory = () => {
    if (messages.length > 2 && currentBot) { // Only save if there's actual conversation
      const conversationData = {
        id: Date.now(),
        botName: currentBot.name,
        botId: currentBot.id,
        botAvatar: currentBot.avatar,
        timestamp: new Date().toISOString(),
        messageCount: messages.length,
        preview: messages[messages.length - 1]?.content?.substring(0, 100) + '...',
        messages: messages
      };

      const updatedHistory = [conversationData, ...conversationHistory.slice(0, 49)]; // Keep last 50 conversations
      setConversationHistory(updatedHistory);
      localStorage.setItem('chatbot_conversation_history', JSON.stringify(updatedHistory));
    }
  };

  // Export conversation as PDF
  const exportConversationAsPDF = (conversation = null) => {
    const conv = conversation || { botName: currentBot?.name, messages, timestamp: new Date().toISOString() };
    
    // Create a simple text content for download as we don't have jsPDF installed
    const content = generateConversationText(conv);
    downloadTextFile(content, `conversation_${conv.botName}_${new Date().toDateString()}.txt`);
  };

  // Export conversation as Word (simplified as text file)
  const exportConversationAsWord = (conversation = null) => {
    const conv = conversation || { botName: currentBot?.name, messages, timestamp: new Date().toISOString() };
    
    const content = generateConversationText(conv);
    downloadTextFile(content, `conversation_${conv.botName}_${new Date().toDateString()}.doc`);
  };

  const generateConversationText = (conversation) => {
    const date = new Date(conversation.timestamp).toLocaleString();
    let content = `CONVERSATION EXPORT\n`;
    content += `========================\n\n`;
    content += `Bot: ${conversation.botName}\n`;
    content += `Date: ${date}\n`;
    content += `Messages: ${conversation.messages?.length || 0}\n\n`;
    content += `CONVERSATION LOG:\n`;
    content += `==================\n\n`;

    (conversation.messages || []).forEach((message, index) => {
      const time = new Date(message.timestamp).toLocaleTimeString();
      const sender = message.type === 'bot' ? `${conversation.botName} Bot` : 'User';
      content += `[${time}] ${sender}:\n`;
      content += `${message.content}\n\n`;
    });

    content += `\n--- End of Conversation ---\n`;
    content += `Generated by Cognizant Autonomous IT Operations Toolkit\n`;
    return content;
  };

  const downloadTextFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadConversationFromHistory = (conversation) => {
    setCurrentBot(allBots[conversation.botId]);
    setMessages(conversation.messages);
    setShowConversationHistory(false);
  };

  const clearConversationHistory = () => {
    setConversationHistory([]);
    localStorage.removeItem('chatbot_conversation_history');
  };

  const filteredHistory = conversationHistory.filter(conv =>
    conv.botName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (botId && allBots[botId]) {
      // Save current conversation before switching
      saveConversationToHistory();
      setCurrentBot(allBots[botId]);
      
      // Initialize with specific welcome message for DevOps Pipeline Developer
      if (botId === 'devops-pipeline') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in creating terraform templates and pipeline configurations for your DevOps needs. I can help you generate customized pipeline code based on your specific requirements.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Would you like me to help you create a new pipeline? I'll need to gather some details about your project to generate the appropriate terraform templates and pipeline configuration.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            actions: [
              { text: 'Create New Pipeline', action: 'start-pipeline-creation' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'build-automate') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in creating terraform templates for cloud infrastructure automation. I can help you build and deploy various cloud resources across different platforms with infrastructure as code.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Would you like me to help you create cloud infrastructure? I'll guide you through the process of defining your infrastructure requirements and generate the appropriate terraform templates.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            actions: [
              { text: 'Create Infrastructure', action: 'start-infrastructure-creation' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'cost-optimization') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in analyzing cloud spending patterns and providing actionable cost optimization recommendations. I can help you identify wasteful spending, optimize resource allocation, and create comprehensive cost analysis dashboards.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Would you like me to analyze your cloud costs and generate optimization recommendations? I'll create a detailed dashboard with charts, graphs, and actionable insights to help you reduce your cloud expenses.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            actions: [
              { text: 'Generate Cost Analysis', action: 'start-cost-optimization' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'unix-permission') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in analyzing Unix/Linux file permission security across cloud environments. I can audit your servers for permission vulnerabilities, identify security risks, and generate comprehensive security reports with actionable recommendations.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Would you like me to perform a file permission security audit? I'll analyze your server for permission violations, vulnerable files, and security risks, then generate a detailed report with visualizations and remediation recommendations.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            actions: [
              { text: 'Start Security Audit', action: 'start-unix-permission-audit' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'change-assist') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in creating comprehensive ServiceNow Change Requests with complete documentation. I can help you gather requirements, generate change plans, rollback procedures, test plans, impact analysis, and manage the entire change request lifecycle.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Would you like me to help you create a ServiceNow Change Request? I'll guide you through collecting all necessary details and generate professional documentation including change plans, rollback procedures, test plans, and impact analysis.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            hasActionButtons: true,
            actions: [
              { text: 'Create Change Request', action: 'start-change-assist' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'knowledge-assist') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in providing ServiceNow knowledge base articles and expert guidance for ticket handling. I can analyze your tickets and provide relevant documentation, best practices, and step-by-step handling recommendations.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Would you like me to help you with a specific ticket? I'll analyze the ticket number and provide you with relevant knowledge base articles and recommended handling procedures.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            hasActionButtons: true,
            actions: [
              { text: 'Get Knowledge Base Articles', action: 'start-knowledge-assist' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'voice-ai') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in providing hands-free IT support through voice conversations. I can listen to your problems and provide spoken solutions, making it easy for you to get help while you work. I'll ask for your employee ID and problem description via voice, then provide audio solutions.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Ready to start a voice conversation? I'll guide you through identifying your IT issues and provide step-by-step solutions entirely through speech. Make sure your microphone and speakers are working properly.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            hasActionButtons: true,
            actions: [
              { text: 'Start Voice Conversation', action: 'start-voice-ai' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else if (botId === 'chat-ai') {
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. I specialize in providing comprehensive IT support through intelligent text-based conversations. I can help diagnose your IT problems, provide step-by-step solutions, and guide you through troubleshooting processes efficiently.`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          },
          {
            id: 2,
            type: 'bot',
            content: `Ready to resolve your IT issues? I'll ask for your employee ID and problem details, then provide you with detailed solutions and guidance. Let's get your technology working smoothly again!`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar,
            hasActionButtons: true,
            actions: [
              { text: 'Start IT Support Chat', action: 'start-chat-ai' },
              { text: 'Ask General Question', action: 'general-chat' }
            ]
          }
        ]);
      } else {
        // Initialize with generic welcome message for other bots
        setMessages([
          {
            id: 1,
            type: 'bot',
            content: `Hello! I'm ${allBots[botId].name}. ${allBots[botId].description} How can I assist you today?`,
            timestamp: new Date(),
            avatar: allBots[botId].avatar
          }
        ]);
      }
      
      // Enable voice mode by default for Voice AI
      if (botId === 'voice-ai') {
        setIsVoiceMode(true);
      }
    }
  }, [botId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const pipelineQuestions = [
    { field: 'pipelineName', question: 'What would you like to name your pipeline?', placeholder: 'e.g., my-app-pipeline' },
    { field: 'repoName', question: 'What is your code repository name?', placeholder: 'e.g., my-app-repo' },
    { field: 'environment', question: 'Which environment is this for?', options: ['dev', 'prod', 'sandbox'] },
    { field: 'appType', question: 'What type of application are you deploying?', options: ['python', 'java'] },
    { field: 'pipelineTool', question: 'Which pipeline tool would you like to use?', placeholder: 'e.g., Jenkins, GitLab CI, GitHub Actions, Azure DevOps' },
    { field: 'stagesCount', question: 'How many stages do you need in your pipeline?', type: 'number', placeholder: 'e.g., 4' }
  ];

  const startPipelineCreation = () => {
    setShowPipelineForm(true);
    setCurrentPipelineStep(0);
    setPipelineDetails({
      pipelineName: '',
      repoName: '',
      environment: '',
      appType: '',
      pipelineTool: '',
      stagesCount: '',
      stages: []
    });
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: "Great! Let's create your pipeline step by step. I'll ask you a few questions to understand your requirements.",
      timestamp: new Date(),
      avatar: currentBot?.avatar
    }]);
    
    // Ask first question
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: pipelineQuestions[0].question,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        isQuestion: true,
        questionData: pipelineQuestions[0]
      }]);
    }, 1000);
  };

  const handlePipelineAnswer = (answer) => {
    const currentQuestion = pipelineQuestions[currentPipelineStep];
    
    // Update pipeline details
    setPipelineDetails(prev => ({
      ...prev,
      [currentQuestion.field]: answer
    }));
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: answer,
      timestamp: new Date()
    }]);
    
    // If asking for stages count, prepare stage collection
    if (currentQuestion.field === 'stagesCount') {
      const stageCount = parseInt(answer);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Perfect! Now I need details for each of the ${stageCount} stages. Let's start with stage 1:`,
          timestamp: new Date(),
          avatar: currentBot?.avatar
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            content: `What would you like to name stage 1 and what should it do?`,
            timestamp: new Date(),
            avatar: currentBot?.avatar,
            isStageQuestion: true,
            stageNumber: 1,
            totalStages: stageCount
          }]);
        }, 1000);
      }, 1000);
      return;
    }
    
    // Move to next question
    const nextStep = currentPipelineStep + 1;
    if (nextStep < pipelineQuestions.length) {
      setCurrentPipelineStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: pipelineQuestions[nextStep].question,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          isQuestion: true,
          questionData: pipelineQuestions[nextStep]
        }]);
      }, 1500);
    }
  };

  const handleStageDetails = (stageName, stageDescription, stageNumber, totalStages) => {
    setPipelineDetails(prev => ({
      ...prev,
      stages: [...prev.stages, { name: stageName, description: stageDescription }]
    }));
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: `Stage ${stageNumber}: ${stageName} - ${stageDescription}`,
      timestamp: new Date()
    }]);
    
    if (stageNumber < totalStages) {
      // Ask for next stage
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Great! Now for stage ${stageNumber + 1}:`,
          timestamp: new Date(),
          avatar: currentBot?.avatar
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            content: `What would you like to name stage ${stageNumber + 1} and what should it do?`,
            timestamp: new Date(),
            avatar: currentBot?.avatar,
            isStageQuestion: true,
            stageNumber: stageNumber + 1,
            totalStages: totalStages
          }]);
        }, 1000);
      }, 1500);
    } else {
      // All stages collected, generate pipeline
      setTimeout(() => {
        generatePipelineCode();
      }, 1500);
    }
  };

  const generatePipelineCode = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const updatedDetails = {
        ...pipelineDetails,
        stages: [...pipelineDetails.stages]
      };
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `Perfect! I have all the information I need. Let me generate your pipeline configuration and terraform templates.`,
        timestamp: new Date(),
        avatar: currentBot?.avatar
      }]);
      
      setTimeout(() => {
        const terraformCode = generateTerraformTemplate(updatedDetails);
        const pipelineCode = generatePipelineConfiguration(updatedDetails);
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Here's your complete pipeline setup:`,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          codeBlocks: [
            {
              title: 'Terraform Template (main.tf)',
              language: 'hcl',
              code: terraformCode
            },
            {
              title: `${updatedDetails.pipelineTool} Pipeline Configuration`,
              language: 'yaml',
              code: pipelineCode
            }
          ]
        }]);
      }, 2000);
      
      setShowPipelineForm(false);
    }, 2000);
  };

  const generateTerraformTemplate = (details) => {
    return `# Terraform configuration for ${details.pipelineName}
# Environment: ${details.environment}
# Application Type: ${details.appType}

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "${details.environment}"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "${details.pipelineName}"
}

# ECR Repository for ${details.appType} application
resource "aws_ecr_repository" "${details.pipelineName.replace(/-/g, '_')}_repo" {
  name                 = "\${var.app_name}-\${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Environment = var.environment
    Application = var.app_name
    Type        = "${details.appType}"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "${details.pipelineName.replace(/-/g, '_')}_cluster" {
  name = "\${var.app_name}-\${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Application Load Balancer
resource "aws_lb" "${details.pipelineName.replace(/-/g, '_')}_alb" {
  name               = "\${var.app_name}-\${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = data.aws_subnets.default.ids

  tags = {
    Environment = var.environment
    Application = var.app_name
  }
}

# Data sources
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Outputs
output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.${details.pipelineName.replace(/-/g, '_')}_repo.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.${details.pipelineName.replace(/-/g, '_')}_cluster.name
}

output "load_balancer_dns" {
  description = "Load balancer DNS name"
  value       = aws_lb.${details.pipelineName.replace(/-/g, '_')}_alb.dns_name
}`;
  };

  const generatePipelineConfiguration = (details) => {
    const stagesYaml = details.stages.map((stage, index) => `
  ${stage.name.toLowerCase().replace(/\s+/g, '-')}:
    stage: ${stage.name}
    script:
      - echo "Executing ${stage.name}: ${stage.description}"
      ${getPipelineStageCommands(stage, details.appType, index)}`).join('');

    return `# ${details.pipelineTool} Pipeline Configuration
# Pipeline: ${details.pipelineName}
# Repository: ${details.repoName}
# Environment: ${details.environment}
# Application Type: ${details.appType}

variables:
  APP_NAME: "${details.pipelineName}"
  ENVIRONMENT: "${details.environment}"
  AWS_DEFAULT_REGION: "us-west-2"
  ECR_REGISTRY: "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
  IMAGE_TAG: "$CI_COMMIT_SHA"

stages:
${details.stages.map(stage => `  - ${stage.name.toLowerCase().replace(/\s+/g, '-')}`).join('\n')}

# Pipeline Jobs
${stagesYaml}

# Additional pipeline configuration
before_script:
  - echo "Setting up pipeline environment"
  - aws --version
  - terraform --version

after_script:
  - echo "Pipeline execution completed"
  - echo "Environment: $ENVIRONMENT"
  - echo "Application: $APP_NAME"`;
  };

  const getPipelineStageCommands = (stage, appType, index) => {
    const stageName = stage.name.toLowerCase();
    
    if (stageName.includes('build') || index === 0) {
      return appType === 'java' ? 
        `      - mvn clean compile
      - mvn test
      - mvn package` :
        `      - pip install -r requirements.txt
      - python -m pytest tests/
      - python setup.py build`;
    }
    
    if (stageName.includes('test') || index === 1) {
      return `      - echo "Running tests for ${appType} application"
      - terraform plan -out=tfplan`;
    }
    
    if (stageName.includes('deploy') || index >= 2) {
      return `      - terraform apply -auto-approve tfplan
      - aws ecs update-service --cluster $APP_NAME-$ENVIRONMENT-cluster --service $APP_NAME-service --force-new-deployment`;
    }
    
    return `      - echo "Executing custom stage: ${stage.description}"`;
  };

  // Infrastructure Creation Workflow for Build Automate Bot
  const resourceTypes = [
    // AWS Resources
    { name: 'AWS EC2 Instance', value: 'aws-ec2', platform: 'aws', type: 'ec2', fields: ['instanceType', 'amiId', 'keyPair', 'securityGroup'] },
    { name: 'AWS S3 Bucket', value: 'aws-s3', platform: 'aws', type: 's3', fields: ['bucketName', 'versioning', 'encryption', 'publicAccess'] },
    { name: 'AWS Lambda Function', value: 'aws-lambda', platform: 'aws', type: 'lambda', fields: ['runtime', 'functionName', 'handler', 'timeout'] },
    // Azure Resources
    { name: 'Azure Virtual Machine', value: 'azure-vm', platform: 'azure', type: 'vm', fields: ['vmSize', 'osType', 'adminUsername', 'networkSecurityGroup'] },
    { name: 'Azure Storage Account', value: 'azure-storage', platform: 'azure', type: 'storage', fields: ['accountTier', 'replicationType', 'accessTier', 'containerName'] },
    // GCP Resources
    { name: 'GCP Compute Instance', value: 'gcp-compute', platform: 'gcp', type: 'compute', fields: ['machineType', 'zone', 'bootDisk', 'networkTags'] },
    { name: 'GCP Cloud Storage', value: 'gcp-storage', platform: 'gcp', type: 'storage', fields: ['bucketName', 'location', 'storageClass', 'uniformAccess'] }
  ];

    const startInfrastructureCreation = () => {
    setShowInfraForm(true);
    setCurrentInfraStep(0);
    setInfraDetails({
      resourceName: '',
      cloudPlatform: '',
      resourceType: '',
      additionalDetails: {}
    });
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: "Great! Let's create your cloud infrastructure. I'll help you define your requirements and generate the terraform templates with a streamlined configuration process.",
      timestamp: new Date(),
      avatar: currentBot?.avatar
    }]);
    
    // Ask for resource type first
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: "What type of infrastructure resource would you like to create?",
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        isInfraQuestion: true,
        questionType: 'resourceTypeSelection',
        options: resourceTypes
      }]);
    }, 1000);
  };

    const handleInfraAnswer = (questionType, answer) => {
    if (questionType === 'resourceTypeSelection') {
      // Parse the selected resource
      const selectedOption = resourceTypes.find(option => option.value === answer);
      const platform = selectedOption.platform;
      const resourceType = selectedOption.type;
      
      setInfraDetails(prev => ({ 
        ...prev, 
        cloudPlatform: platform, 
        resourceType: resourceType 
      }));
      
      // Add user message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: selectedOption.name,
        timestamp: new Date()
      }]);
      
      // Show Resource Configuration modal
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Perfect! Now I'll open the Resource Configuration form for your ${selectedOption.name}. Please fill in the required details to proceed.`,
          timestamp: new Date(),
          avatar: currentBot?.avatar
        }]);
        
        setSelectedResourceConfig({
          platform: platform,
          type: resourceType,
          name: selectedOption.name
        });
        setShowResourceConfigModal(true);
      }, 1500);
      
    } else if (questionType === 'confirmInfraCreation') {
      if (answer === 'yes') {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'user',
          content: 'Yes, create the infrastructure',
          timestamp: new Date()
        }]);
        
        setTimeout(() => {
          generateInfrastructureTemplate();
        }, 1000);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'user',
          content: 'No, let me modify the configuration',
          timestamp: new Date()
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            content: 'No problem! Let me reopen the Resource Configuration form so you can make changes.',
            timestamp: new Date(),
            avatar: currentBot?.avatar
          }]);
          
          setShowResourceConfigModal(true);
        }, 1500);
      }
    }
  };

  const handleResourceConfigSubmit = (configData) => {
    // Update infrastructure details with form data
    setInfraDetails(prev => ({
      ...prev,
      resourceName: configData.resourceName,
      additionalDetails: configData
    }));
    
    // Close modal
    setShowResourceConfigModal(false);
    
    // Add summary message
    setTimeout(() => {
      const summary = generateConfigSummary(configData);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `Excellent! Here's a summary of your infrastructure configuration:`,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        hasConfigSummary: true,
        summaryData: summary
      }]);
      
      // Ask for confirmation
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Please review the configuration above. Would you like me to proceed with creating the terraform templates?`,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          isInfraQuestion: true,
          questionType: 'confirmInfraCreation',
          options: [
            { name: 'Yes, create the infrastructure', value: 'yes' },
            { name: 'No, let me modify the configuration', value: 'no' }
          ]
        }]);
      }, 2000);
    }, 1000);
  };

  const generateConfigSummary = (configData) => {
    return {
      resourceName: configData.resourceName,
      platform: infraDetails.cloudPlatform.toUpperCase(),
      type: selectedResourceConfig?.name || 'Infrastructure',
      details: configData
    };
  };

  const askForAdditionalDetail = (fieldName, index, totalFields) => {
    const fieldPrompts = {
      // AWS Fields
      instanceType: { question: "What EC2 instance type do you need?", options: ["t2.micro", "t2.small", "t2.medium", "t3.micro", "t3.small"], default: "t2.micro" },
      amiId: { question: "Enter the AMI ID or choose a default:", placeholder: "ami-0c55b159cbfafe1d0 (or leave blank for latest Amazon Linux)" },
      keyPair: { question: "What is your EC2 key pair name?", placeholder: "my-key-pair" },
      securityGroup: { question: "Security group configuration:", options: ["Create new (default)", "Use existing"], default: "Create new (default)" },
      bucketName: { question: "S3 bucket name (must be globally unique):", placeholder: "my-unique-bucket-name-123" },
      versioning: { question: "Enable S3 versioning?", options: ["Enabled", "Disabled"], default: "Enabled" },
      encryption: { question: "Enable S3 encryption?", options: ["AES256", "aws:kms", "Disabled"], default: "AES256" },
      publicAccess: { question: "Block public access?", options: ["Yes (Recommended)", "No"], default: "Yes (Recommended)" },
      
      // Azure Fields
      vmSize: { question: "What VM size do you need?", options: ["Standard_B1s", "Standard_B2s", "Standard_D2s_v3", "Standard_F2s_v2"], default: "Standard_B1s" },
      osType: { question: "Operating system:", options: ["Linux", "Windows"], default: "Linux" },
      adminUsername: { question: "Administrator username:", placeholder: "azureuser" },
      
      // GCP Fields
      machineType: { question: "What machine type do you need?", options: ["e2-micro", "e2-small", "e2-medium", "n1-standard-1"], default: "e2-micro" },
      zone: { question: "GCP zone:", options: ["us-central1-a", "us-west1-a", "europe-west1-a"], default: "us-central1-a" },
      
      // Common fields
      runtime: { question: "Runtime environment:", placeholder: "nodejs14, python3.9, java11, etc." },
      location: { question: "Region/Location:", placeholder: "us-east-1, eastus, us-central1" }
    };

    const prompt = fieldPrompts[fieldName] || { question: `Enter ${fieldName}:`, placeholder: `${fieldName} value` };
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: `${prompt.question} (${index + 1}/${totalFields})`,
      timestamp: new Date(),
      avatar: currentBot?.avatar,
      isInfraQuestion: true,
      questionType: `detail_${fieldName}`,
      options: prompt.options,
      placeholder: prompt.placeholder,
      defaultValue: prompt.default
    }]);
  };

  const generateInfrastructureTemplate = () => {
    setIsTyping(true);
    setTimeout(() => {
        setIsTyping(false);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `Perfect! I have all the information needed. Let me generate your terraform template for the ${infraDetails.cloudPlatform.toUpperCase()} infrastructure.`,
        timestamp: new Date(),
        avatar: currentBot?.avatar
      }]);
      
      setTimeout(() => {
        const terraformCode = generateInfrastructureTerraform();
        const variablesCode = generateVariablesFile();
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Here's your complete terraform infrastructure template:`,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
          codeBlocks: [
            {
              title: 'main.tf - Infrastructure Configuration',
              language: 'hcl',
              code: terraformCode
            },
            {
              title: 'variables.tf - Input Variables',
              language: 'hcl',
              code: variablesCode
            }
          ]
        }]);
      }, 2000);
      
      setShowInfraForm(false);
    }, 2000);
  };

  const generateInfrastructureTerraform = () => {
    const { cloudPlatform, resourceType, resourceName, additionalDetails } = infraDetails;
    
    switch (cloudPlatform) {
      case 'aws':
        return generateAWSTerraform(resourceType, resourceName, additionalDetails);
      case 'azure':
        return generateAzureTerraform(resourceType, resourceName, additionalDetails);
      case 'gcp':
        return generateGCPTerraform(resourceType, resourceName, additionalDetails);
      default:
        return '# Terraform configuration not available for selected platform';
    }
  };

  const generateAWSTerraform = (resourceType, resourceName, details) => {
    const baseConfig = `# AWS ${resourceName} Infrastructure
# Generated by Build Automate Bot

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}`;

    switch (resourceType) {
      case 'ec2':
        return `${baseConfig}

# Security Group for EC2 Instance
resource "aws_security_group" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_sg" {
  name        = "${resourceName}-security-group"
  description = "Security group for ${resourceName} EC2 instance"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${resourceName}-sg"
  }
}

# EC2 Instance
resource "aws_instance" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = var.key_pair
  
  vpc_security_group_ids = [aws_security_group.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_sg.id]

  tags = {
    Name = "${resourceName}"
  }
}

# Outputs
output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.id
}

output "public_ip" {
  description = "Public IP address"
  value       = aws_instance.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.public_ip
}`;

      case 's3':
        return `${baseConfig}

# S3 Bucket
resource "aws_s3_bucket" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  bucket = var.bucket_name

  tags = {
    Name = "${resourceName}"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_versioning" {
  bucket = aws_s3_bucket.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.id
  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Disabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_encryption" {
  bucket = aws_s3_bucket.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = var.encryption_algorithm
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_pab" {
  bucket = aws_s3_bucket.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.id

  block_public_acls       = var.block_public_access
  block_public_policy     = var.block_public_access
  ignore_public_acls      = var.block_public_access
  restrict_public_buckets = var.block_public_access
}

# Outputs
output "bucket_name" {
  description = "S3 bucket name"
  value       = aws_s3_bucket.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.bucket
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.arn
}`;

      case 'lambda':
        return `${baseConfig}

# IAM Role for Lambda
resource "aws_iam_role" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_role" {
  name = "${resourceName}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy Attachment
resource "aws_iam_role_policy_attachment" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_policy" {
  role       = aws_iam_role.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function
resource "aws_lambda_function" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  filename         = "function.zip"
  function_name    = var.function_name
  role            = aws_iam_role.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_role.arn
  handler         = var.handler
  runtime         = var.runtime
  timeout         = var.timeout

  tags = {
    Name = "${resourceName}"
  }
}

# Outputs
output "function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.function_name
}

output "function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}.arn
}`;

      default:
        return `${baseConfig}

# Resource configuration for ${resourceType}
# Please customize this template based on your specific requirements`;
    }
  };

  const generateAzureTerraform = (resourceType, resourceName, details) => {
    return `# Azure ${resourceName} Infrastructure
# Generated by Build Automate Bot

terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_rg" {
  name     = "${resourceName}-rg"
  location = var.location
}

# Configure based on resource type
${resourceType === 'vm' ? `
# Virtual Network
resource "azurerm_virtual_network" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_vnet" {
  name                = "${resourceName}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_rg.location
  resource_group_name = azurerm_resource_group.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_rg.name
}

# Subnet
resource "azurerm_subnet" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_subnet" {
  name                 = "${resourceName}-subnet"
  resource_group_name  = azurerm_resource_group.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_rg.name
  virtual_network_name = azurerm_virtual_network.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_vnet.name
  address_prefixes     = ["10.0.2.0/24"]
}

# Virtual Machine
resource "azurerm_linux_virtual_machine" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  name                = "${resourceName}"
  resource_group_name = azurerm_resource_group.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_rg.name
  location            = azurerm_resource_group.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_rg.location
  size                = var.vm_size
  admin_username      = var.admin_username

  network_interface_ids = [
    azurerm_network_interface.${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}_nic.id,
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts"
    version   = "latest"
  }
}` : `# ${resourceType} configuration will be added here`}`;
  };

  const generateGCPTerraform = (resourceType, resourceName, details) => {
    return `# GCP ${resourceName} Infrastructure
# Generated by Build Automate Bot

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

${resourceType === 'compute' ? `
# Compute Instance
resource "google_compute_instance" "${resourceName.replace(/[^a-zA-Z0-9]/g, '_')}" {
  name         = "${resourceName}"
  machine_type = var.machine_type
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
    
    access_config {
      // Ephemeral public IP
    }
  }

  tags = ["${resourceName}"]
}` : `# ${resourceType} configuration will be added here`}`;
  };

  const generateVariablesFile = () => {
    const { cloudPlatform, resourceType, additionalDetails } = infraDetails;
    
    let variables = `# Input Variables
# Generated by Build Automate Bot

`;

    switch (cloudPlatform) {
      case 'aws':
        variables += `variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

`;
        if (resourceType === 'ec2') {
          variables += `variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "${additionalDetails.instanceType || 't2.micro'}"
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
  default     = "${additionalDetails.amiId || 'ami-0c55b159cbfafe1d0'}"
}

variable "key_pair" {
  description = "EC2 Key Pair name"
  type        = string
  default     = "${additionalDetails.keyPair || 'my-key-pair'}"
}`;
        }
        break;
        
      case 'azure':
        variables += `variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}`;
        break;
        
      case 'gcp':
        variables += `variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "${additionalDetails.zone || 'us-central1-a'}"
}`;
        break;
    }

         return variables;
  };

  // Cost Optimization Workflow for Cost Optimization Recommendation Agent
  const startCostOptimization = () => {
    setShowCostOptForm(true);
    setCurrentCostOptStep(0);
    setCostOptDetails({
      cloudPlatform: '',
      currentSpending: '',
      savingsGoal: '',
      optimizationFocus: [],
      timeFrame: '',
      priority: '',
      analysisComplete: false
    });
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: "Excellent! I'll create a personalized cost optimization analysis based on your specific requirements and savings goals. Let me gather some details to provide the most accurate recommendations.",
      timestamp: new Date(),
      avatar: currentBot?.avatar
    }]);
    
    // Ask for cloud platform
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: "First, which cloud platform would you like me to analyze for cost optimization?",
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        isCostOptQuestion: true,
        questionType: 'cloudPlatform',
        options: [
          { name: 'Amazon Web Services (AWS)', value: 'aws', icon: '☁️' },
          { name: 'Microsoft Azure', value: 'azure', icon: '🔷' },
          { name: 'Google Cloud Platform (GCP)', value: 'gcp', icon: '🟡' },
          { name: 'Multi-Cloud Analysis', value: 'multi-cloud', icon: '🌐' }
        ]
      }]);
    }, 1500);
  };

  const costOptQuestions = [
    {
      type: 'cloudPlatform',
      question: 'First, which cloud platform would you like me to analyze for cost optimization?',
      options: [
        { name: 'Amazon Web Services (AWS)', value: 'aws', icon: '☁️' },
        { name: 'Microsoft Azure', value: 'azure', icon: '🔷' },
        { name: 'Google Cloud Platform (GCP)', value: 'gcp', icon: '🟡' },
        { name: 'Multi-Cloud Analysis', value: 'multi-cloud', icon: '🌐' }
      ]
    },
    {
      type: 'optimizationFocus',
      question: 'Which areas would you like to focus on for optimization? (Select your primary concern)',
      options: [
        { name: 'Compute Resources (EC2/VMs)', value: 'compute', icon: '🖥️' },
        { name: 'Storage & Databases', value: 'storage', icon: '💾' },
        { name: 'Network & Data Transfer', value: 'network', icon: '🌐' },
        { name: 'Serverless & Functions', value: 'serverless', icon: '⚡' },
        { name: 'Overall Infrastructure', value: 'overall', icon: '🏗️' }
      ]
    },
    {
      type: 'savingsGoal',
      question: 'And how much you want to save?',
      options: [
        { name: '10-15% reduction', value: '15', icon: '🎯' },
        { name: '20-25% reduction', value: '25', icon: '🎯' },
        { name: '30-40% reduction', value: '40', icon: '🎯' },
        { name: 'Maximum possible savings (50%+)', value: '50', icon: '🚀' }
      ]
    }
  ];

  const [currentCostOptStep, setCurrentCostOptStep] = useState(0);

  const handleCostOptAnswer = (questionType, answer) => {
    // Update details
    setCostOptDetails(prev => ({ ...prev, [questionType]: answer }));
    
    // Add user message
    const currentQuestion = costOptQuestions.find(q => q.type === questionType);
    let displayAnswer = answer;
    
    if (currentQuestion && currentQuestion.options) {
      const selectedOption = currentQuestion.options.find(opt => opt.value === answer);
      displayAnswer = selectedOption ? selectedOption.name : answer;
    }
    
    if (questionType === 'cloudPlatform') {
      displayAnswer = answer === 'multi-cloud' ? 'Multi-Cloud Analysis' : answer.toUpperCase();
    }
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: displayAnswer,
      timestamp: new Date()
    }]);
    
    // Move to next question or finish
    const nextStep = currentCostOptStep + 1;
    
    if (nextStep < costOptQuestions.length) {
      setCurrentCostOptStep(nextStep);
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: costOptQuestions[nextStep].question,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          isCostOptQuestion: true,
          questionType: costOptQuestions[nextStep].type,
          options: costOptQuestions[nextStep].options
        }]);
      }, 1500);
    } else {
      // All questions answered, generate analysis
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: "Perfect! I have all the information I need. Let me analyze your requirements and generate a personalized cost optimization dashboard...",
          timestamp: new Date(),
          avatar: currentBot?.avatar
        }]);
        
        setTimeout(() => {
          generatePersonalizedCostOptimization();
        }, 3000);
      }, 1500);
    }
  };

  const generatePersonalizedCostOptimization = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setCostOptDetails(prev => ({ ...prev, analysisComplete: true }));
      
      const { cloudPlatform, optimizationFocus, savingsGoal } = costOptDetails;
      
      const focusAreaDisplay = {
        'compute': 'Compute Resources (EC2/VMs)',
        'storage': 'Storage & Databases',
        'network': 'Network & Data Transfer',
        'serverless': 'Serverless & Functions',
        'overall': 'Overall Infrastructure'
      };
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `🎉 Personalized analysis complete! Based on your ${cloudPlatform.toUpperCase()} platform, focusing on ${focusAreaDisplay[optimizationFocus]}, with a ${savingsGoal}% savings target, here's your customized optimization dashboard:`,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        hasDashboard: true,
        dashboardData: generatePersonalizedDashboardData(costOptDetails)
      }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `🎯 **Personalized Optimization Strategy** for ${focusAreaDisplay[optimizationFocus]}:`,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          hasRecommendations: true,
          recommendations: generatePersonalizedRecommendations(costOptDetails)
        }]);
      }, 2000);
      
      setShowCostOptForm(false);
    }, 2500);
  };

  const generatePersonalizedDashboardData = (userInputs) => {
    const { cloudPlatform, optimizationFocus, savingsGoal } = userInputs;
    
    // Generate realistic baseline cost based on focus area and platform
    const baselineCosts = {
      'compute': { aws: 12000, azure: 11500, gcp: 10800, 'multi-cloud': 13500 },
      'storage': { aws: 8500, azure: 8200, gcp: 7800, 'multi-cloud': 9200 },
      'network': { aws: 6500, azure: 6800, gcp: 6200, 'multi-cloud': 7500 },
      'serverless': { aws: 4200, azure: 4500, gcp: 4000, 'multi-cloud': 5000 },
      'overall': { aws: 15000, azure: 14500, gcp: 13800, 'multi-cloud': 16200 }
    };
    
    const baseCost = baselineCosts[optimizationFocus][cloudPlatform] || 12000;
    const targetSavingsPercentage = parseInt(savingsGoal);
    const potentialSavings = Math.floor(baseCost * (targetSavingsPercentage / 100));
    
    // Adjust optimization score based on savings goal and focus area
    let optimizationScore = 75; // base score
    if (targetSavingsPercentage >= 40) optimizationScore -= 15; // aggressive goals mean current score is lower
    if (optimizationFocus === 'compute') optimizationScore -= 5; // compute usually has more optimization potential
    if (optimizationFocus === 'serverless') optimizationScore += 10; // serverless is generally more optimized
    
    const baseData = {
      totalMonthlyCost: baseCost,
      potentialSavings: potentialSavings,
      optimizationScore: Math.max(45, Math.min(85, optimizationScore)),
      resourceUtilization: optimizationFocus === 'serverless' ? 75 : optimizationFocus === 'compute' ? 55 : 65
    };

    // Customize cost breakdown based on optimization focus
    const focusMultipliers = {
      compute: { compute: 1.5, storage: 0.8, network: 0.7, serverless: 0.6 },
      storage: { compute: 0.8, storage: 1.5, network: 0.7, serverless: 0.6 },
      network: { compute: 0.8, storage: 0.7, network: 1.5, serverless: 0.6 },
      serverless: { compute: 0.7, storage: 0.6, network: 0.7, serverless: 1.5 },
      overall: { compute: 1.0, storage: 1.0, network: 1.0, serverless: 1.0 }
    };

    const multiplier = focusMultipliers[optimizationFocus] || focusMultipliers.overall;

    const costBreakdownTemplates = {
      aws: [
        { name: 'EC2 Instances', basePercent: 0.35, savingsMultiplier: multiplier.compute, color: '#FF6B6B' },
        { name: 'RDS Databases', basePercent: 0.25, savingsMultiplier: multiplier.storage, color: '#4ECDC4' },
        { name: 'S3 Storage', basePercent: 0.15, savingsMultiplier: multiplier.storage, color: '#45B7D1' },
        { name: 'Lambda Functions', basePercent: 0.10, savingsMultiplier: multiplier.serverless, color: '#96CEB4' },
        { name: 'Data Transfer', basePercent: 0.15, savingsMultiplier: multiplier.network, color: '#FFEAA7' }
      ],
      azure: [
        { name: 'Virtual Machines', basePercent: 0.40, savingsMultiplier: multiplier.compute, color: '#FF6B6B' },
        { name: 'SQL Database', basePercent: 0.20, savingsMultiplier: multiplier.storage, color: '#4ECDC4' },
        { name: 'Blob Storage', basePercent: 0.15, savingsMultiplier: multiplier.storage, color: '#45B7D1' },
        { name: 'App Services', basePercent: 0.15, savingsMultiplier: multiplier.serverless, color: '#96CEB4' },
        { name: 'Networking', basePercent: 0.10, savingsMultiplier: multiplier.network, color: '#FFEAA7' }
      ],
      gcp: [
        { name: 'Compute Engine', basePercent: 0.38, savingsMultiplier: multiplier.compute, color: '#FF6B6B' },
        { name: 'Cloud SQL', basePercent: 0.22, savingsMultiplier: multiplier.storage, color: '#4ECDC4' },
        { name: 'Cloud Storage', basePercent: 0.18, savingsMultiplier: multiplier.storage, color: '#45B7D1' },
        { name: 'Cloud Functions', basePercent: 0.12, savingsMultiplier: multiplier.serverless, color: '#96CEB4' },
        { name: 'Network Egress', basePercent: 0.10, savingsMultiplier: multiplier.network, color: '#FFEAA7' }
      ]
    };

    const template = costBreakdownTemplates[cloudPlatform] || costBreakdownTemplates.aws;
    const costBreakdown = template.map(item => ({
      name: item.name,
      cost: baseCost * item.basePercent,
      savings: Math.floor((baseCost * item.basePercent * (targetSavingsPercentage / 100)) * item.savingsMultiplier),
      color: item.color
    }));

    return {
      ...baseData,
      cloudPlatform,
      costBreakdown,
      monthlyTrend: generatePersonalizedMonthlyTrend(baseCost, targetSavingsPercentage),
      resourceEfficiency: generatePersonalizedResourceEfficiency(optimizationFocus, savingsGoal)
    };
  };

  const generatePersonalizedMonthlyTrend = (baseCost, savingsGoal) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      actual: Math.floor(baseCost + (Math.random() * 1000 - 500) + (index * 100)),
      predicted: Math.floor(baseCost * (1 - savingsGoal / 100) + (Math.random() * 500 - 250) + (index * 50))
    }));
  };

  const generatePersonalizedResourceEfficiency = (focus, savingsGoal) => {
    const baseEfficiency = {
      'CPU Utilization': { current: 45, target: 75, color: '#FF6B6B' },
      'Memory Usage': { current: 38, target: 70, color: '#4ECDC4' },
      'Storage Efficiency': { current: 62, target: 80, color: '#45B7D1' },
      'Network Optimization': { current: 58, target: 85, color: '#96CEB4' }
    };

    // Adjust efficiency based on focus area
    if (focus === 'compute') {
      baseEfficiency['CPU Utilization'].current = 35;
      baseEfficiency['Memory Usage'].current = 30;
    } else if (focus === 'storage') {
      baseEfficiency['Storage Efficiency'].current = 45;
    } else if (focus === 'network') {
      baseEfficiency['Network Optimization'].current = 40;
    }

    // Adjust based on savings goal (higher goals indicate more room for improvement)
    const targetSavings = parseInt(savingsGoal);
    if (targetSavings >= 40) {
      // Aggressive savings goal - show more room for improvement
      Object.keys(baseEfficiency).forEach(key => {
        baseEfficiency[key].current -= 10;
      });
    } else if (targetSavings >= 25) {
      // Moderate savings goal
      Object.keys(baseEfficiency).forEach(key => {
        baseEfficiency[key].current -= 5;
      });
    }

    return Object.keys(baseEfficiency).map(name => ({
      name,
      current: Math.max(20, Math.min(90, baseEfficiency[name].current)),
      target: Math.max(50, Math.min(95, baseEfficiency[name].target)),
      color: baseEfficiency[name].color
    }));
  };



  const generatePersonalizedRecommendations = (userInputs) => {
    const { cloudPlatform, optimizationFocus, savingsGoal } = userInputs;
    
    // Generate baseline cost based on focus area and platform
    const baselineCosts = {
      'compute': { aws: 12000, azure: 11500, gcp: 10800, 'multi-cloud': 13500 },
      'storage': { aws: 8500, azure: 8200, gcp: 7800, 'multi-cloud': 9200 },
      'network': { aws: 6500, azure: 6800, gcp: 6200, 'multi-cloud': 7500 },
      'serverless': { aws: 4200, azure: 4500, gcp: 4000, 'multi-cloud': 5000 },
      'overall': { aws: 15000, azure: 14500, gcp: 13800, 'multi-cloud': 16200 }
    };
    
    const baseCost = baselineCosts[optimizationFocus][cloudPlatform] || 12000;
    const targetSavings = parseInt(savingsGoal);
    const urgency = targetSavings >= 40 ? 'HIGH' : targetSavings >= 25 ? 'MEDIUM' : 'STANDARD';

    // Base recommendations by platform and focus
    const platformRecommendations = {
      aws: {
        compute: [
          `🖥️ **EC2 Right-sizing** (${urgency} Priority): Analyze and downsize over-provisioned instances - estimated $${Math.floor(baseCost * 0.35 * targetSavings / 100)}/month savings`,
          `📊 **CloudWatch insights**: Enable detailed monitoring to identify idle instances during peak and off-peak hours`,
          `⚖️ **Auto Scaling Groups**: Implement dynamic scaling based on actual demand patterns`
        ],
        storage: [
          `💾 **EBS Volume Optimization**: Convert gp2 to gp3 volumes for 20% cost reduction - estimated $${Math.floor(baseCost * 0.25 * 0.2)}/month`,
          `📦 **S3 Intelligent Tiering**: Automatically move data between access tiers - potential $${Math.floor(baseCost * 0.15 * targetSavings / 100)}/month savings`,
          `🗄️ **RDS Storage Optimization**: Implement Aurora Serverless for variable workloads`
        ],
        network: [
          `🌐 **CloudFront CDN**: Reduce data transfer costs by 40-60% - save $${Math.floor(baseCost * 0.15 * 0.5)}/month`,
          `📡 **VPC Endpoint Implementation**: Eliminate NAT Gateway costs for AWS services`,
          `🔄 **Direct Connect**: For high data transfer volumes (${baseCost > 15000 ? 'RECOMMENDED' : 'Consider for future'})`
        ],
        serverless: [
          `⚡ **Lambda Memory Optimization**: Right-size Lambda functions for 30% cost reduction`,
          `🔄 **Step Functions**: Replace long-running Lambda with state machines`,
          `📊 **API Gateway Caching**: Reduce Lambda invocations by 70%`
        ],
        overall: [
          `🔄 **Reserved Instances**: Purchase 1-year RIs for stable workloads - ${targetSavings >= 30 ? '3-year commitments for maximum savings' : '1-year for flexibility'}`,
          `💰 **Savings Plans**: More flexible than RIs, 15% additional savings`,
          `📋 **Cost Allocation Tags**: Implement comprehensive tagging for cost visibility`,
          `🎯 **AWS Cost Explorer**: Set up anomaly detection and budget alerts`
        ]
      },
      azure: {
        compute: [
          `🖥️ **VM Right-sizing** (${urgency} Priority): Optimize underutilized VMs - estimated $${Math.floor(baseCost * 0.40 * targetSavings / 100)}/month savings`,
          `🕐 **Auto-shutdown Policies**: Implement automated shutdown for dev/test environments - 30-50% cost reduction`,
          `💰 **Azure Hybrid Benefit**: Apply existing Windows licenses for 40% VM cost reduction`
        ],
        storage: [
          `💽 **SQL Database Elastic Pools**: Optimize database costs by 30-50%`,
          `📁 **Blob Storage Tiering**: Implement lifecycle management for archival data`,
          `🔄 **Managed Disks Optimization**: Convert to Premium SSD v2 for better price/performance`
        ],
        network: [
          `🌐 **Azure CDN**: Reduce bandwidth costs by implementing content delivery network`,
          `📡 **ExpressRoute**: For consistent high-bandwidth requirements`,
          `🔗 **Private Endpoints**: Eliminate data transfer charges for Azure services`
        ],
        overall: [
          `📋 **Azure Reservations**: Lock in ${targetSavings >= 30 ? '3-year' : '1-year'} commitments for up to 72% savings`,
          `💼 **Azure Dev/Test Pricing**: Apply discounted rates for non-production workloads`,
          `📊 **Azure Cost Management**: Set up automated cost optimization recommendations`
        ]
      },
      gcp: {
        compute: [
          `🖥️ **Compute Engine Rightsizing** (${urgency} Priority): Optimize machine types - estimated $${Math.floor(baseCost * 0.38 * targetSavings / 100)}/month savings`,
          `⏰ **Preemptible Instances**: Use for batch processing - up to 80% cost reduction`,
          `🎯 **Custom Machine Types**: Create optimal CPU/memory ratios for workloads`
        ],
        storage: [
          `💿 **Persistent Disk Optimization**: Switch to balanced persistent disks for better performance/cost`,
          `🗄️ **Cloud Storage Classes**: Implement nearline/coldline for archival data`,
          `📊 **Cloud SQL Optimization**: Use read replicas and connection pooling`
        ],
        network: [
          `🌐 **Cloud CDN**: Implement global content delivery for reduced egress costs`,
          `📡 **Premium Network Tier**: For performance-critical applications only`,
          `🔄 **Private Google Access**: Eliminate external IP costs for internal services`
        ],
        overall: [
          `💳 **Committed Use Discounts**: ${targetSavings >= 30 ? '3-year commitments' : '1-year commitments'} for up to 57% savings`,
          `⚡ **Sustained Use Discounts**: Automatic discounts for long-running workloads`,
          `📋 **Cloud Billing Export**: Set up BigQuery analysis for cost insights`
        ]
      }
    };

    // Get relevant recommendations based on focus
    let recommendations = [];
    
    if (optimizationFocus === 'overall') {
      // Include recommendations from all categories
      const platform = platformRecommendations[cloudPlatform] || platformRecommendations.aws;
      recommendations = [
        ...platform.compute.slice(0, 1),
        ...platform.storage.slice(0, 1),
        ...platform.network.slice(0, 1),
        ...platform.overall.slice(0, 2)
      ];
    } else {
      // Focus on specific area
      const platform = platformRecommendations[cloudPlatform] || platformRecommendations.aws;
      const focusArea = platform[optimizationFocus] || platform.overall;
      recommendations = [...focusArea];
      
      // Add one general recommendation
      recommendations.push(platform.overall[0]);
    }

    // Add savings-goal specific recommendations
    if (targetSavings >= 40) {
      recommendations.unshift(`💸 **Aggressive Cost Optimization**: Given your ${targetSavings}% savings target, consider migration to spot/preemptible instances where possible - additional 60-80% savings on compute`);
    } else if (targetSavings >= 25) {
      recommendations.push(`🎯 **Balanced Optimization**: Focus on substantial savings while maintaining performance - optimize instance types and storage tiers`);
    } else {
      recommendations.push(`🛡️ **Conservative Approach**: Implement cost optimization without compromising reliability - gradual optimization with minimal risk`);
    }

    // Add quick wins based on optimization focus
    if (optimizationFocus === 'compute') {
      recommendations.unshift(`⚡ **Quick Wins**: Start with auto-scheduling and instance right-sizing for immediate impact - potential $${Math.floor(baseCost * 0.15)}/month quick savings`);
    } else if (optimizationFocus === 'storage') {
      recommendations.unshift(`📦 **Storage Quick Wins**: Begin with intelligent tiering and lifecycle policies - immediate 20-30% storage cost reduction`);
    }

         return recommendations;
   };

   // Unix File Permission Audit Workflow
   const startUnixPermissionAudit = () => {
     setShowUnixPermForm(true);
     setUnixPermDetails({
       cloudPlatform: '',
       serverHostname: ''
     });
     
     setMessages(prev => [...prev, {
       id: Date.now(),
       type: 'bot',
       content: "Excellent! I'll perform a comprehensive file permission security audit of your server. Let me gather some details to provide an accurate security assessment.",
       timestamp: new Date(),
       avatar: currentBot?.avatar
     }]);
     
     // Ask for cloud platform
     setTimeout(() => {
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'bot',
         content: "First, which cloud platform is your server hosted on?",
         timestamp: new Date(),
         avatar: currentBot?.avatar,
         isUnixPermQuestion: true,
         questionType: 'cloudPlatform',
         options: [
           { name: 'Amazon Web Services (AWS)', value: 'aws', icon: '☁️' },
           { name: 'Microsoft Azure', value: 'azure', icon: '🔷' },
           { name: 'Google Cloud Platform (GCP)', value: 'gcp', icon: '🟡' },
           { name: 'On-Premises Infrastructure', value: 'on-premises', icon: '🏢' },
           { name: 'Other Cloud Provider', value: 'other', icon: '🌐' }
         ]
       }]);
     }, 1500);
   };

   const handleUnixPermAnswer = (questionType, answer) => {
     // Update details
     setUnixPermDetails(prev => ({ ...prev, [questionType]: answer }));
     
     // Add user message
     let displayAnswer = answer;
     
     if (questionType === 'cloudPlatform') {
       const platformNames = {
         'aws': 'Amazon Web Services (AWS)',
         'azure': 'Microsoft Azure',
         'gcp': 'Google Cloud Platform (GCP)',
         'on-premises': 'On-Premises Infrastructure',
         'other': 'Other Cloud Provider'
       };
       displayAnswer = platformNames[answer] || answer;
       
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'user',
         content: displayAnswer,
         timestamp: new Date()
       }]);
       
       // Ask for server hostname/IP
       setTimeout(() => {
         setMessages(prev => [...prev, {
           id: Date.now(),
           type: 'bot',
           content: "Perfect! Now, please provide the server hostname or IP address that you'd like me to audit:",
           timestamp: new Date(),
           avatar: currentBot?.avatar,
           isUnixPermQuestion: true,
           questionType: 'serverHostname',
           placeholder: 'e.g., web-server-01, 192.168.1.100, prod-db.company.com'
         }]);
       }, 1500);
       
     } else if (questionType === 'serverHostname') {
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'user',
         content: answer,
         timestamp: new Date()
       }]);
       
       // Start security audit
       setTimeout(() => {
         setMessages(prev => [...prev, {
           id: Date.now(),
           type: 'bot',
           content: `Initiating security audit for server ${answer} on ${unixPermDetails.cloudPlatform.toUpperCase()}. Scanning file permissions, analyzing vulnerabilities, and generating comprehensive report...`,
           timestamp: new Date(),
           avatar: currentBot?.avatar
         }]);
         
         setTimeout(() => {
           generateUnixPermissionReport();
         }, 4000);
       }, 1500);
     }
   };

   const generateUnixPermissionReport = () => {
     setIsTyping(true);
     setTimeout(() => {
       setIsTyping(false);
       setUnixPermDetails(prev => ({ ...prev, analysisComplete: true }));
       
       const reportData = generateMockSecurityData();
       
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'bot',
         content: `🛡️ Security audit complete! I've analyzed ${reportData.totalFiles} files and identified ${reportData.vulnerabilities.length} security vulnerabilities. Here's your comprehensive file permission security report:`,
         timestamp: new Date(),
         avatar: currentBot?.avatar,
         hasSecurityReport: true,
         reportData: reportData
       }]);
       
       setTimeout(() => {
         setMessages(prev => [...prev, {
           id: Date.now(),
           type: 'bot',
           content: `📋 **Critical Security Recommendations:**`,
           timestamp: new Date(),
           avatar: currentBot?.avatar,
           hasSecurityRecommendations: true,
           recommendations: generateSecurityRecommendations(reportData)
         }]);
       }, 2000);
       
       setShowUnixPermForm(false);
     }, 3500);
   };

   const generateMockSecurityData = () => {
     const { cloudPlatform, serverHostname } = unixPermDetails;
     
     // Generate realistic file permission violations
     const vulnerableDirectories = [
       '/var/www/html', '/tmp', '/home/user', '/opt/application',
       '/var/log', '/etc/cron.d', '/usr/local/bin'
     ];
     
     const fileExtensions = ['.sh', '.conf', '.log', '.key', '.pem', '.sql', '.php', '.py'];
     const criticalFiles = [];
     const permissionViolations = [];
     const files777 = [];
     
     // Generate critical files with vulnerabilities
     for (let i = 0; i < 15; i++) {
       const dir = vulnerableDirectories[Math.floor(Math.random() * vulnerableDirectories.length)];
       const fileName = `file${i + 1}${fileExtensions[Math.floor(Math.random() * fileExtensions.length)]}`;
       const fullPath = `${dir}/${fileName}`;
       const permissions = ['644', '755', '777', '666', '600', '700'][Math.floor(Math.random() * 6)];
       
       criticalFiles.push({
         path: fullPath,
         permissions,
         owner: ['root', 'www-data', 'user', 'admin'][Math.floor(Math.random() * 4)],
         group: ['root', 'www-data', 'users', 'admin'][Math.floor(Math.random() * 4)],
         riskLevel: permissions === '777' ? 'Critical' : permissions === '666' ? 'High' : 'Medium',
         lastModified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
       });
       
       if (permissions === '777' || permissions === '666') {
         permissionViolations.push({
           path: fullPath,
           currentPermissions: permissions,
           recommendedPermissions: permissions === '777' ? '755' : '644',
           riskLevel: permissions === '777' ? 'Critical' : 'High',
           vulnerability: permissions === '777' ? 'World writable and executable' : 'World writable'
         });
         
         if (permissions === '777') {
           files777.push({
             path: fullPath,
             owner: criticalFiles[i].owner,
             group: criticalFiles[i].group,
             description: 'Full permissions for all users - CRITICAL SECURITY RISK'
           });
         }
       }
     }
     
     return {
       serverInfo: {
         hostname: serverHostname,
         cloudPlatform: cloudPlatform.toUpperCase(),
         auditDate: new Date().toISOString().split('T')[0],
         auditTime: new Date().toLocaleTimeString()
       },
       totalFiles: Math.floor(Math.random() * 5000) + 2000,
       scannedDirectories: vulnerableDirectories.length,
       vulnerabilities: permissionViolations,
       criticalFiles,
       files777,
       securityScore: Math.max(30, 85 - (permissionViolations.length * 5)),
       riskDistribution: {
         critical: files777.length,
         high: permissionViolations.filter(v => v.riskLevel === 'High').length,
         medium: permissionViolations.filter(v => v.riskLevel === 'Medium').length,
         low: Math.floor(Math.random() * 10) + 5
       }
     };
   };

     const generateSecurityRecommendations = (reportData) => {
    const recommendations = [
      `🔒 **Immediate Action Required**: Found ${reportData.files777.length} files with 777 permissions - remove write access for others immediately`,
      `⚠️ **High Priority**: ${reportData.vulnerabilities.filter(v => v.riskLevel === 'High').length} files have excessive write permissions - restrict to necessary users only`,
      `🛡️ **Security Hardening**: Implement principle of least privilege - review and minimize permissions for all ${reportData.vulnerabilities.length} flagged files`,
      `📋 **Access Control**: Set up proper file ownership and group permissions for web directories and application files`,
      `🔍 **Continuous Monitoring**: Implement automated file permission monitoring to detect unauthorized changes`,
      `📊 **Regular Audits**: Schedule monthly permission audits to maintain security compliance`,
      `🔐 **Sensitive Files**: Secure configuration files and private keys with 600 permissions (owner read/write only)`
    ];
    
    // Add platform-specific recommendations
    if (reportData.serverInfo.cloudPlatform === 'AWS') {
      recommendations.push(`☁️ **AWS Security**: Use IAM roles and policies to control access, enable CloudTrail for audit logging`);
    } else if (reportData.serverInfo.cloudPlatform === 'AZURE') {
      recommendations.push(`🔷 **Azure Security**: Implement Azure Security Center recommendations and enable diagnostic logging`);
    } else if (reportData.serverInfo.cloudPlatform === 'GCP') {
      recommendations.push(`🟡 **GCP Security**: Use Cloud Security Command Center and enable audit logs for comprehensive monitoring`);
    }
    
    return recommendations;
  };

  // Change Assist Workflow for ServiceNow Change Request
  const changeAssistQuestions = [
    {
      question: "What is the name of the Configuration Item (CI) you want to change?",
      field: "ciName",
      type: "text",
      placeholder: "e.g., PROD-WEB-SERVER-01, Database-MySQL-Cluster"
    },
    {
      question: "Please provide a detailed description of the Configuration Item:",
      field: "ciDescription", 
      type: "text",
      placeholder: "e.g., Production web server hosting customer portal application"
    },
    {
      question: "What is the Operating System of this CI?",
      field: "operatingSystem",
      type: "select",
      options: [
        "Windows Server 2019",
        "Windows Server 2022", 
        "Ubuntu 20.04 LTS",
        "Ubuntu 22.04 LTS",
        "CentOS 7",
        "CentOS 8",
        "Red Hat Enterprise Linux 8",
        "Red Hat Enterprise Linux 9",
        "Amazon Linux 2",
        "Debian 11"
      ]
    },
    {
      question: "Please describe the change you want to implement and why it's needed:",
      field: "changeDescription",
      type: "textarea",
      placeholder: "e.g., Update Apache web server from version 2.4.41 to 2.4.54 to address security vulnerabilities and improve performance"
    },
    {
      question: "What is your preferred change window (date and time)?",
      field: "changeWindow",
      type: "text",
      placeholder: "e.g., Saturday, March 15, 2024, 2:00 AM - 4:00 AM EST"
    },
    {
      question: "What is the priority level of this change?",
      field: "priority",
      type: "select", 
      options: ["Low", "Medium", "High", "Critical"]
    },
    {
      question: "What is the risk level associated with this change?",
      field: "riskLevel",
      type: "select",
      options: ["Low", "Medium", "High"]
    }
  ];

  const startChangeAssist = () => {
    setShowChangeAssistForm(true);
    setCurrentChangeStep(0);
    setChangeAssistDetails({
      ciName: '',
      ciDescription: '',
      operatingSystem: '',
      changeDescription: '',
      changeWindow: '',
      priority: '',
      riskLevel: ''
    });
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: "Perfect! I'll help you create a comprehensive ServiceNow Change Request with all necessary documentation. Let's gather the required information step by step.",
      timestamp: new Date(),
      avatar: currentBot?.avatar
    }]);
    
    // Ask first question
    setTimeout(() => {
      const firstQuestion = changeAssistQuestions[0];
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: firstQuestion.question,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        isChangeAssistQuestion: true,
        questionType: firstQuestion.field,
        inputType: firstQuestion.type,
        options: firstQuestion.options,
        placeholder: firstQuestion.placeholder
      }]);
    }, 1000);
  };

  const handleChangeAssistAnswer = (questionType, answer) => {
    if (questionType === 'confirmServiceNowCreation') {
      // Add user message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: answer,
        timestamp: new Date()
      }]);
      
      if (answer === 'Yes, create the ServiceNow Change Request') {
        setTimeout(() => {
          createServiceNowChangeRequest();
        }, 1000);
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            content: "No problem! Let me restart the process so you can modify your requirements. What would you like to change?",
            timestamp: new Date(),
            avatar: currentBot?.avatar,
            hasActionButtons: true,
            actions: [
              { text: "Start Over", action: "start-change-assist" },
              { text: "General Chat", action: "general-chat" }
            ]
          }]);
        }, 1500);
      }
      return;
    }
    
    // Update change assist details
    setChangeAssistDetails(prev => ({ ...prev, [questionType]: answer }));
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: answer,
      timestamp: new Date()
    }]);
    
    const currentQuestionIndex = changeAssistQuestions.findIndex(q => q.field === questionType);
    
    if (currentQuestionIndex < changeAssistQuestions.length - 1) {
      // Ask next question
      setTimeout(() => {
        const nextQuestion = changeAssistQuestions[currentQuestionIndex + 1];
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: nextQuestion.question,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          isChangeAssistQuestion: true,
          questionType: nextQuestion.field,
          inputType: nextQuestion.type,
          options: nextQuestion.options,
          placeholder: nextQuestion.placeholder
        }]);
      }, 1500);
    } else {
      // All questions answered, generate documents
      setTimeout(() => {
        generateChangeDocuments();
      }, 1500);
    }
  };

  const generateChangeDocuments = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const documents = generateChangeRequestDocuments(changeAssistDetails);
      setGeneratedDocuments(documents);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `📋 Excellent! I've generated all the required ServiceNow change request documents based on your requirements. Here are the documents I've created:`,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        hasChangeDocuments: true,
        documents: documents
      }]);
      
      // Ask for confirmation
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `Please review the generated documents above. Would you like me to proceed with creating the ServiceNow Change Request using these documents?`,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          isChangeAssistQuestion: true,
          questionType: 'confirmServiceNowCreation',
          inputType: 'select',
          options: ['Yes, create the ServiceNow Change Request', 'No, let me modify the details first']
        }]);
      }, 2000);
      
    }, 3000);
  };

  const generateChangeRequestDocuments = (details) => {
    const changeRequestNumber = `CHG${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`;
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const changePlan = `SERVICENOW CHANGE PLAN
=====================================
Change Request Number: ${changeRequestNumber}
Configuration Item: ${details.ciName}
Date Created: ${currentDate} ${currentTime}

CHANGE OVERVIEW:
- CI Name: ${details.ciName}
- CI Description: ${details.ciDescription}
- Operating System: ${details.operatingSystem}
- Change Window: ${details.changeWindow}
- Priority: ${details.priority}
- Risk Level: ${details.riskLevel}

CHANGE DESCRIPTION:
${details.changeDescription}

IMPLEMENTATION STEPS:
1. Pre-change verification
   - Verify CI status and availability
   - Confirm maintenance window
   - Notify stakeholders

2. Change implementation
   - Take system backup/snapshot
   - Implement the planned change
   - Verify change success

3. Post-change validation
   - Conduct functional testing
   - Monitor system performance
   - Document any issues

RESOURCES REQUIRED:
- System Administrator
- Application Owner
- Database Administrator (if applicable)
- Network Administrator (if applicable)

ESTIMATED DURATION: 2-4 hours
ROLLBACK TIME: 30 minutes
`;

    const rollbackPlan = `SERVICENOW ROLLBACK PLAN
===================================
Change Request Number: ${changeRequestNumber}
Configuration Item: ${details.ciName}

ROLLBACK TRIGGER CONDITIONS:
- Change implementation fails
- System performance degrades significantly
- Critical functionality is impacted
- Unforeseen complications arise

ROLLBACK PROCEDURES:
1. Immediate Actions
   - Stop the change implementation
   - Notify change manager and stakeholders
   - Document the failure reason

2. System Restoration
   - Restore from backup/snapshot taken before change
   - Verify system functionality
   - Restart services if necessary

3. Validation Steps
   - Confirm system is back to original state
   - Test critical business functions
   - Monitor for 30 minutes post-rollback

4. Communication
   - Notify all stakeholders of rollback completion
   - Schedule post-mortem review
   - Update change request with lessons learned

ROLLBACK RESOURCES:
- System Administrator (Primary)
- Database Administrator (If DB changes)
- Network Administrator (If network changes)
- Application Owner for validation

ESTIMATED ROLLBACK TIME: 30-60 minutes
`;

    const testPlan = `SERVICENOW TEST PLAN
==========================
Change Request Number: ${changeRequestNumber}
Configuration Item: ${details.ciName}

PRE-CHANGE TESTING:
1. System Health Check
   - CPU utilization < 80%
   - Memory usage < 85%
   - Disk space > 20% free
   - Network connectivity verified

2. Application Functionality
   - Core business functions operational
   - User authentication working
   - Database connectivity confirmed
   - API endpoints responding

POST-CHANGE TESTING:
1. System Verification
   - Service start-up successful
   - System logs review for errors
   - Performance metrics within acceptable range
   - Security configurations intact

2. Functional Testing
   - User login/logout functionality
   - Core application features
   - Data integrity verification
   - Integration points validation

3. Performance Testing
   - Response time measurements
   - Load capacity verification
   - Resource utilization monitoring
   - Error rate analysis

ACCEPTANCE CRITERIA:
✓ All critical functions operational
✓ Performance within 5% of baseline
✓ No critical errors in logs
✓ User acceptance sign-off received

TEST DURATION: 1-2 hours
SIGN-OFF REQUIRED: Application Owner, System Administrator
`;

    const impactAnalysis = `SERVICENOW IMPACT ANALYSIS
====================================
Change Request Number: ${changeRequestNumber}
Configuration Item: ${details.ciName}

BUSINESS IMPACT ASSESSMENT:

Impact Level: ${details.riskLevel}
Priority: ${details.priority}
Affected Users: ${details.riskLevel === 'High' ? '500+ users' : details.riskLevel === 'Medium' ? '100-500 users' : '< 100 users'}
Downtime Expected: ${details.riskLevel === 'High' ? '2-4 hours' : details.riskLevel === 'Medium' ? '1-2 hours' : '< 1 hour'}

TECHNICAL IMPACT:
- System: ${details.ciName}
- Operating System: ${details.operatingSystem}
- Services Affected: Web services, database connections, user sessions

BUSINESS FUNCTIONS AFFECTED:
${details.riskLevel === 'High' ? 
  '- Customer-facing applications\n- E-commerce transactions\n- User authentication\n- Data processing pipelines' :
  details.riskLevel === 'Medium' ?
  '- Internal applications\n- Reporting systems\n- Administrative functions' :
  '- Development environments\n- Testing systems\n- Non-critical services'
}

RISK MITIGATION:
- Comprehensive backup strategy implemented
- Rollback plan tested and ready
- 24/7 support team on standby
- Communication plan for stakeholders

COMMUNICATION PLAN:
- 48 hours notice: Stakeholder notification
- 24 hours notice: User notification
- During change: Real-time status updates
- Post-change: Completion confirmation

DEPENDENCIES:
- No other changes scheduled during window
- All dependent systems identified
- External vendor coordination (if required)
- Change advisory board approval

SUCCESS METRICS:
- Zero unplanned downtime
- All functionality restored within SLA
- No data loss or corruption
- User satisfaction maintained

POST-IMPLEMENTATION REVIEW:
- Scheduled for 48 hours post-change
- Include all stakeholders
- Document lessons learned
- Update procedures if necessary
`;

    return {
      changeRequestNumber,
      changePlan,
      rollbackPlan,
      testPlan,
      impactAnalysis,
      generatedDate: currentDate,
      generatedTime: currentTime
    };
  };

  const createServiceNowChangeRequest = () => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const crNumber = generatedDocuments.changeRequestNumber;
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `🎉 **ServiceNow Change Request Created Successfully!**`,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        hasServiceNowDetails: true,
        serviceNowData: {
          changeRequestNumber: crNumber,
          status: 'New',
          state: 'Draft',
          priority: changeAssistDetails.priority,
          riskLevel: changeAssistDetails.riskLevel,
          requestedBy: 'System User',
          assignedTo: 'Change Management Team',
          ciName: changeAssistDetails.ciName,
          changeWindow: changeAssistDetails.changeWindow,
          createdDate: currentDate,
          createdTime: currentTime,
          approvalRequired: changeAssistDetails.riskLevel === 'High' ? 'CAB Approval' : 'Manager Approval'
        }
      }]);
      
            setShowChangeAssistForm(false);
    }, 2500);
  };

  // Knowledge Assist Workflow for ServiceNow Knowledge Base
  const startKnowledgeAssist = () => {
    setShowKnowledgeAssistForm(true);
    setKnowledgeAssistDetails({
      ticketNumber: '',
      ticketType: '',
      category: '',
      priority: ''
    });
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      content: "Perfect! I'm your Knowledge Assist bot. I can help you find relevant ServiceNow knowledge base articles and provide expert recommendations for handling your tickets. Let's get started!",
      timestamp: new Date(),
      avatar: currentBot?.avatar
    }]);
    
    // Ask for ticket number
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: "Please provide the ticket number you need assistance with:",
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        isKnowledgeAssistQuestion: true,
        questionType: 'ticketNumber',
        inputType: 'text',
        placeholder: 'e.g., INC0012345, REQ0067890, CHG0001234'
      }]);
    }, 1000);
  };

  const handleKnowledgeAssistAnswer = (questionType, answer) => {
    if (questionType === 'ticketNumber') {
      // Update knowledge assist details
      setKnowledgeAssistDetails(prev => ({ ...prev, ticketNumber: answer }));
      
      // Add user message
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: answer,
        timestamp: new Date()
      }]);
      
      // Analyze ticket and generate knowledge base articles
      setTimeout(() => {
        analyzeTicketAndGenerateKB(answer);
      }, 1500);
    }
  };

  const analyzeTicketAndGenerateKB = (ticketNumber) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Analyze ticket type from ticket number prefix
      const ticketType = getTicketTypeFromNumber(ticketNumber);
      const ticketCategory = getTicketCategory(ticketNumber);
      const priority = getTicketPriority(ticketNumber);
      
      // Update details
      setKnowledgeAssistDetails(prev => ({
        ...prev,
        ticketType: ticketType,
        category: ticketCategory,
        priority: priority
      }));
      
      // Generate knowledge base articles
      const articles = generateKnowledgeBaseArticles(ticketNumber, ticketType, ticketCategory);
      setKnowledgeBaseArticles(articles);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: `📋 **Ticket Analysis Complete!**\n\n**Ticket:** ${ticketNumber}\n**Type:** ${ticketType}\n**Category:** ${ticketCategory}\n**Priority:** ${priority}\n\nI've found ${articles.length} relevant knowledge base articles and best practices for handling this type of ticket:`,
        timestamp: new Date(),
        avatar: currentBot?.avatar,
        hasKnowledgeBase: true,
        knowledgeArticles: articles,
        ticketInfo: {
          number: ticketNumber,
          type: ticketType,
          category: ticketCategory,
          priority: priority
        }
      }]);
      
      // Provide handling recommendations
      setTimeout(() => {
        const recommendations = generateHandlingRecommendations(ticketType, ticketCategory, priority);
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          content: `🎯 **Recommended Handling Approach:**`,
          timestamp: new Date(),
          avatar: currentBot?.avatar,
          hasHandlingRecommendations: true,
          recommendations: recommendations
        }]);
      }, 2000);
      
      setShowKnowledgeAssistForm(false);
    }, 3000);
  };

  const getTicketTypeFromNumber = (ticketNumber) => {
    const prefix = ticketNumber.substring(0, 3).toUpperCase();
    switch (prefix) {
      case 'INC': return 'Incident';
      case 'REQ': return 'Service Request';
      case 'CHG': return 'Change Request';
      case 'PRB': return 'Problem';
      case 'TSK': return 'Task';
      case 'STD': return 'Standard Change';
      default: return 'Incident';
    }
  };

  const getTicketCategory = (ticketNumber) => {
    // Generate category based on ticket number pattern
    const num = parseInt(ticketNumber.slice(-4));
    const categories = [
      'Software', 'Hardware', 'Network', 'Security', 'Access Management',
      'Application Support', 'Database', 'Email & Collaboration', 
      'Infrastructure', 'Backup & Recovery', 'Performance', 'Mobile Devices'
    ];
    return categories[num % categories.length];
  };

  const getTicketPriority = (ticketNumber) => {
    const num = parseInt(ticketNumber.slice(-2));
    if (num % 4 === 0) return 'Critical';
    if (num % 3 === 0) return 'High';
    if (num % 2 === 0) return 'Medium';
    return 'Low';
  };

  const generateKnowledgeBaseArticles = (ticketNumber, ticketType, category) => {
    const baseArticles = {
      'Incident': {
        'Software': [
          {
            id: 'KB0001234',
            title: 'Application Crash Troubleshooting Guide',
            summary: 'Step-by-step guide to diagnose and resolve common application crashes',
            category: 'Software',
            relevanceScore: 95,
            lastUpdated: '2024-01-15',
            viewCount: 1247
          },
          {
            id: 'KB0001567',
            title: 'Software Installation Issues Resolution',
            summary: 'Common software installation problems and their solutions',
            category: 'Software',
            relevanceScore: 87,
            lastUpdated: '2024-01-10',
            viewCount: 892
          },
          {
            id: 'KB0002134',
            title: 'License Activation Problems',
            summary: 'Resolving software license activation and validation issues',
            category: 'Software',
            relevanceScore: 78,
            lastUpdated: '2024-01-08',
            viewCount: 654
          }
        ],
        'Hardware': [
          {
            id: 'KB0003456',
            title: 'Hardware Diagnostic Procedures',
            summary: 'Comprehensive hardware troubleshooting methodology',
            category: 'Hardware',
            relevanceScore: 92,
            lastUpdated: '2024-01-12',
            viewCount: 1045
          },
          {
            id: 'KB0003789',
            title: 'Printer and Peripheral Issues',
            summary: 'Common printer connectivity and functionality problems',
            category: 'Hardware',
            relevanceScore: 85,
            lastUpdated: '2024-01-14',
            viewCount: 723
          }
        ],
        'Network': [
          {
            id: 'KB0004567',
            title: 'Network Connectivity Troubleshooting',
            summary: 'Diagnosing and resolving network connection issues',
            category: 'Network',
            relevanceScore: 94,
            lastUpdated: '2024-01-13',
            viewCount: 1356
          },
          {
            id: 'KB0004890',
            title: 'VPN Connection Problems',
            summary: 'Common VPN connectivity issues and solutions',
            category: 'Network',
            relevanceScore: 88,
            lastUpdated: '2024-01-11',
            viewCount: 967
          }
        ],
        'Security': [
          {
            id: 'KB0005678',
            title: 'Security Incident Response Procedures',
            summary: 'Immediate actions for security-related incidents',
            category: 'Security',
            relevanceScore: 96,
            lastUpdated: '2024-01-16',
            viewCount: 1523
          },
          {
            id: 'KB0005901',
            title: 'Malware Detection and Removal',
            summary: 'Identifying and removing malicious software',
            category: 'Security',
            relevanceScore: 91,
            lastUpdated: '2024-01-09',
            viewCount: 1178
          }
        ]
      },
      'Service Request': {
        'Access Management': [
          {
            id: 'KB0006789',
            title: 'User Account Provisioning Process',
            summary: 'Standard procedure for creating new user accounts',
            category: 'Access Management',
            relevanceScore: 93,
            lastUpdated: '2024-01-14',
            viewCount: 856
          },
          {
            id: 'KB0007012',
            title: 'Password Reset Procedures',
            summary: 'Self-service and admin password reset methods',
            category: 'Access Management',
            relevanceScore: 89,
            lastUpdated: '2024-01-12',
            viewCount: 1234
          }
        ],
        'Software': [
          {
            id: 'KB0007345',
            title: 'Software Request Approval Workflow',
            summary: 'Process for requesting and approving new software',
            category: 'Software',
            relevanceScore: 90,
            lastUpdated: '2024-01-15',
            viewCount: 678
          }
        ]
      },
      'Change Request': {
        'Infrastructure': [
          {
            id: 'KB0008456',
            title: 'Infrastructure Change Management Process',
            summary: 'Best practices for implementing infrastructure changes',
            category: 'Infrastructure',
            relevanceScore: 95,
            lastUpdated: '2024-01-16',
            viewCount: 1567
          }
        ]
      }
    };

    // Get articles for the specific ticket type and category
    const typeArticles = baseArticles[ticketType] || {};
    const categoryArticles = typeArticles[category] || [];
    
    // If no specific articles, provide general ones
    if (categoryArticles.length === 0) {
      return [
        {
          id: 'KB0009999',
          title: `General ${ticketType} Handling Guidelines`,
          summary: `Best practices and procedures for handling ${ticketType.toLowerCase()} tickets`,
          category: 'General',
          relevanceScore: 75,
          lastUpdated: '2024-01-10',
          viewCount: 456
        },
        {
          id: 'KB0009998',
          title: 'ServiceNow Ticket Management Best Practices',
          summary: 'Comprehensive guide to effective ticket management in ServiceNow',
          category: 'General',
          relevanceScore: 70,
          lastUpdated: '2024-01-08',
          viewCount: 789
        }
      ];
    }
    
    return categoryArticles;
  };

  const generateHandlingRecommendations = (ticketType, category, priority) => {
    const baseRecommendations = {
      'Incident': {
        'Critical': [
          '🚨 **Immediate Action Required** - This is a critical incident affecting business operations',
          '📞 **Escalate immediately** to on-call engineer and notify management',
          '🔍 **Begin impact assessment** - Document affected users and systems',
          '📋 **Create war room** if multiple teams are involved',
          '⏱️ **Target resolution time: 1-2 hours** based on SLA requirements',
          '📢 **Communicate status** to stakeholders every 30 minutes'
        ],
        'High': [
          '⚡ **High priority handling** - Significant business impact identified',
          '🎯 **Assign to senior technician** with expertise in this category',
          '📊 **Document impact scope** and affected user count',
          '⏱️ **Target resolution time: 4-8 hours** based on SLA',
          '📱 **Provide regular updates** to affected users'
        ],
        'Medium': [
          '📋 **Standard incident process** - Follow established procedures',
          '🔧 **Assign based on team workload** and expertise',
          '📝 **Gather detailed information** from the requester',
          '⏱️ **Target resolution time: 1-2 business days**',
          '📧 **Send acknowledgment** within 1 hour'
        ],
        'Low': [
          '📌 **Queue for standard processing** - No immediate urgency',
          '👥 **Can be handled by junior staff** with oversight',
          '📚 **Check knowledge base** for similar issues first',
          '⏱️ **Target resolution time: 3-5 business days**',
          '✅ **Acknowledge within 4 hours**'
        ]
      },
      'Service Request': {
        'Critical': [
          '🔥 **Urgent service request** - Business critical need',
          '✅ **Fast-track approval process** if pre-approved',
          '📋 **Verify request details** and business justification',
          '⏱️ **Target fulfillment: Same day** if possible',
          '📞 **Contact requester** to confirm urgency and details'
        ],
        'High': [
          '📈 **High priority service** - Important business need',
          '🔍 **Review approval requirements** and obtain if needed',
          '📊 **Check resource availability** for fulfillment',
          '⏱️ **Target fulfillment: 1-2 business days**',
          '✉️ **Provide estimated completion date**'
        ],
        'Medium': [
          '📋 **Standard service request** - Follow normal workflow',
          '✅ **Verify approval status** and requirements',
          '📅 **Schedule based on team capacity**',
          '⏱️ **Target fulfillment: 3-5 business days**',
          '📧 **Send regular status updates**'
        ],
        'Low': [
          '📌 **Standard queue processing** - No rush required',
          '📚 **Check if self-service option** is available',
          '👥 **Can be handled by available team members**',
          '⏱️ **Target fulfillment: 5-10 business days**',
          '✅ **Acknowledge within 24 hours**'
        ]
      },
      'Change Request': [
        '📋 **Follow change management process** according to ServiceNow workflow',
        '🔍 **Review change details** and impact assessment',
        '✅ **Verify all approvals** are in place before implementation',
        '📅 **Confirm maintenance window** and stakeholder notifications',
        '🧪 **Ensure rollback plan** is documented and tested',
        '📊 **Coordinate with affected teams** and dependencies',
        '📝 **Document implementation steps** in detail',
        '✅ **Conduct post-implementation review** within 48 hours'
      ]
    };

    if (ticketType === 'Change Request') {
      return baseRecommendations['Change Request'];
    }

    const typeRecommendations = baseRecommendations[ticketType];
    if (typeRecommendations && typeRecommendations[priority]) {
      return typeRecommendations[priority];
    }

    // Default recommendations
    return [
      '📋 **Follow standard procedures** for this ticket type',
      '🔍 **Gather complete information** before proceeding',
      '📚 **Reference knowledge base articles** for guidance',
      '👥 **Collaborate with team members** if needed',
      '📝 **Document all actions taken** in the ticket',
      '✅ **Verify resolution** with the requester before closing'
         ];
   };

   // Voice AI Workflow for Audio Conversations
   const initializeVoiceAPI = () => {
     // Initialize Speech Recognition
     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
       const recognition = new SpeechRecognition();
       recognition.continuous = false;
       recognition.interimResults = false;
       recognition.lang = 'en-US';
       setVoiceRecognition(recognition);
     }

     // Initialize Speech Synthesis
     if ('speechSynthesis' in window) {
       setVoiceSynthesis(window.speechSynthesis);
     }
   };

   const startVoiceAI = () => {
     setShowVoiceAIForm(true);
     setVoiceAIDetails({
       employeeId: '',
       problemStatement: '',
       conversationStage: 'welcome'
     });

     // Initialize voice APIs
     initializeVoiceAPI();

     setMessages(prev => [...prev, {
       id: Date.now(),
       type: 'bot',
       content: "🎤 **Voice AI Activated!** I'm ready to have an audio conversation with you to help resolve your IT issues. Please ensure your microphone is enabled and click the button below to start our voice conversation.",
       timestamp: new Date(),
       avatar: currentBot?.avatar,
       hasVoiceControls: true,
       voiceStage: 'welcome'
     }]);
   };

   const startVoiceConversation = () => {
     setVoiceAIDetails(prev => ({ ...prev, conversationStage: 'employeeId' }));
     
     const welcomeMessage = "Hello! I'm your Voice AI assistant. I'm here to help you with your IT problems. Let's start by getting your employee ID. Please speak your employee ID clearly.";
     
     speakMessage(welcomeMessage, () => {
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'bot',
         content: "🎤 **Listening for your Employee ID...** Please speak clearly when you're ready.",
         timestamp: new Date(),
         avatar: currentBot?.avatar,
         hasVoiceControls: true,
         voiceStage: 'employeeId',
         isListening: true
       }]);
       startListening('employeeId');
     });
   };

   const speakMessage = (text, callback = null) => {
     if (voiceSynthesis && 'speechSynthesis' in window) {
       // Cancel any ongoing speech
       speechSynthesis.cancel();
       
       const utterance = new SpeechSynthesisUtterance(text);
       utterance.rate = 0.9;
       utterance.pitch = 1;
       utterance.volume = 1;
       
       // Find a suitable voice (prefer female voices for AI assistant)
       const voices = speechSynthesis.getVoices();
       const preferredVoice = voices.find(voice => 
         voice.name.includes('Zira') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Google UK English Female') ||
         voice.lang.includes('en')
       );
       
       if (preferredVoice) {
         utterance.voice = preferredVoice;
       }

       if (callback) {
         utterance.onend = callback;
       }

       speechSynthesis.speak(utterance);
     } else if (callback) {
       // If speech synthesis is not available, just call the callback
       setTimeout(callback, 1000);
     }
   };

   const startListening = (stage) => {
     if (!voiceRecognition) {
       console.error('Speech recognition not available');
       return;
     }

     setIsListeningForVoice(true);

     voiceRecognition.onstart = () => {
       console.log('Voice recognition started');
     };

     voiceRecognition.onresult = (event) => {
       const transcript = event.results[0][0].transcript;
       handleVoiceInput(stage, transcript);
     };

     voiceRecognition.onerror = (event) => {
       console.error('Speech recognition error:', event.error);
       setIsListeningForVoice(false);
       
       const errorMessage = "I'm sorry, I couldn't hear you clearly. Let me try again.";
       speakMessage(errorMessage, () => {
         setTimeout(() => startListening(stage), 1000);
       });
     };

     voiceRecognition.onend = () => {
       setIsListeningForVoice(false);
     };

     voiceRecognition.start();
   };

   const handleVoiceInput = (stage, transcript) => {
     setIsListeningForVoice(false);

     // Add user's spoken input to chat
     setMessages(prev => [...prev, {
       id: Date.now(),
       type: 'user',
       content: `🎤 "${transcript}"`,
       timestamp: new Date(),
       isVoiceInput: true
     }]);

     if (stage === 'employeeId') {
       handleEmployeeIdInput(transcript);
     } else if (stage === 'problem') {
       handleProblemStatementInput(transcript);
     }
   };

   const handleEmployeeIdInput = (employeeId) => {
     setVoiceAIDetails(prev => ({ 
       ...prev, 
       employeeId: employeeId,
       conversationStage: 'problem'
     }));

     const confirmationMessage = `Thank you! I've recorded your employee ID as ${employeeId}. Now, please describe your IT problem in detail. What specific issue are you experiencing?`;
     
     speakMessage(confirmationMessage, () => {
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'bot',
         content: "🎤 **Listening for your problem description...** Please describe your IT issue in detail.",
         timestamp: new Date(),
         avatar: currentBot?.avatar,
         hasVoiceControls: true,
         voiceStage: 'problem',
         isListening: true
       }]);
       startListening('problem');
     });
   };

   const handleProblemStatementInput = (problemStatement) => {
     setVoiceAIDetails(prev => ({ 
       ...prev, 
       problemStatement: problemStatement,
       conversationStage: 'solution'
     }));

     const acknowledgmentMessage = `I understand your problem: ${problemStatement}. Let me analyze this and provide you with a solution.`;
     
     speakMessage(acknowledgmentMessage, () => {
       analyzeProblemAndProvideSolution(problemStatement);
     });
   };

   const analyzeProblemAndProvideSolution = (problemStatement) => {
     // Simulate analysis time
     setMessages(prev => [...prev, {
       id: Date.now(),
       type: 'bot',
       content: "🤖 **Analyzing your problem...** Please wait while I search for the best solution.",
       timestamp: new Date(),
       avatar: currentBot?.avatar
     }]);

     setTimeout(() => {
       const solution = generateVoiceSolution(problemStatement);
       const analysisResult = analyzeIfSolutionExists(problemStatement);

       if (analysisResult.canSolve) {
         // Provide solution via voice
         const solutionMessage = `I found a solution for your problem! ${solution.description} Here's what you need to do: ${solution.steps.join('. ')} This should resolve your issue. Is there anything else I can help you with?`;
         
         speakMessage(solutionMessage, () => {
           setMessages(prev => [...prev, {
             id: Date.now(),
             type: 'bot',
             content: "✅ **Solution Provided via Voice!** Check the detailed solution below:",
             timestamp: new Date(),
             avatar: currentBot?.avatar,
             hasVoiceSolution: true,
             solution: solution,
             hasVoiceControls: true,
             voiceStage: 'complete'
           }]);
         });
       } else {
         // Request manual ticket creation
         const ticketMessage = `I understand your issue, but this appears to be a complex problem that requires specialized attention. I recommend creating a manual ticket for proper investigation. Our support team will be able to provide more detailed assistance. Would you like me to guide you on how to create a support ticket?`;
         
         speakMessage(ticketMessage, () => {
           setMessages(prev => [...prev, {
             id: Date.now(),
             type: 'bot',
             content: "📋 **Manual Ticket Required** - This issue needs specialized attention from our support team.",
             timestamp: new Date(),
             avatar: currentBot?.avatar,
             hasTicketRecommendation: true,
             problemStatement: problemStatement,
             hasVoiceControls: true,
             voiceStage: 'ticket'
           }]);
         });
       }

       setVoiceAIDetails(prev => ({ ...prev, conversationStage: 'complete' }));
       setShowVoiceAIForm(false);
     }, 3000);
   };

   const analyzeIfSolutionExists = (problemStatement) => {
     const lowerProblem = problemStatement.toLowerCase();
     
     // Common problems that can be solved remotely
     const solvableKeywords = [
       'password', 'login', 'forgot', 'reset', 'wifi', 'internet', 'connection',
       'email', 'outlook', 'slow', 'freeze', 'restart', 'update', 'install',
       'printer', 'print', 'software', 'application', 'error message'
     ];

     // Complex problems that need manual tickets
     const complexKeywords = [
       'hardware', 'broken', 'damaged', 'blue screen', 'crash', 'virus',
       'malware', 'security breach', 'data loss', 'corruption', 'upgrade'
     ];

     const hasComplexIssue = complexKeywords.some(keyword => lowerProblem.includes(keyword));
     const hasSolvableIssue = solvableKeywords.some(keyword => lowerProblem.includes(keyword));

     return {
       canSolve: hasSolvableIssue && !hasComplexIssue,
       complexity: hasComplexIssue ? 'high' : hasSolvableIssue ? 'low' : 'medium'
     };
   };

   const generateVoiceSolution = (problemStatement) => {
     const lowerProblem = problemStatement.toLowerCase();

     if (lowerProblem.includes('password') || lowerProblem.includes('login')) {
       return {
         title: 'Password Reset Solution',
         description: 'This appears to be a password-related issue that can be resolved through our standard reset procedure.',
         steps: [
           'Go to your organization\'s login page',
           'Click on "Forgot Password" link',
           'Enter your employee ID or email address',
           'Check your email for a reset link',
           'Follow the instructions in the email to create a new password',
           'Try logging in with your new password'
         ],
         estimatedTime: '5-10 minutes',
         category: 'Authentication'
       };
     }

     if (lowerProblem.includes('wifi') || lowerProblem.includes('internet') || lowerProblem.includes('connection')) {
       return {
         title: 'Network Connectivity Solution',
         description: 'This is a network connectivity issue that can often be resolved with basic troubleshooting steps.',
         steps: [
           'Check if your WiFi is turned on',
           'Forget and reconnect to your WiFi network',
           'Restart your device\'s network adapter',
           'Move closer to the WiFi router if possible',
           'Contact your network administrator if the issue persists'
         ],
         estimatedTime: '3-5 minutes',
         category: 'Network'
       };
     }

     if (lowerProblem.includes('email') || lowerProblem.includes('outlook')) {
       return {
         title: 'Email Client Solution',
         description: 'This email issue can typically be resolved by refreshing your email client connection.',
         steps: [
           'Close your email application completely',
           'Restart your email client',
           'Check your internet connection',
           'Verify your email server settings',
           'Try accessing email through web browser as an alternative'
         ],
         estimatedTime: '5 minutes',
         category: 'Email'
       };
     }

     if (lowerProblem.includes('slow') || lowerProblem.includes('freeze')) {
       return {
         title: 'Performance Issue Solution',
         description: 'Performance issues can often be resolved by clearing system resources and restarting applications.',
         steps: [
           'Close any unnecessary applications',
           'Check your device\'s available storage space',
           'Restart your computer',
           'Clear your browser cache if the issue is web-related',
           'Run a disk cleanup utility'
         ],
         estimatedTime: '10-15 minutes',
         category: 'Performance'
       };
     }

     if (lowerProblem.includes('printer') || lowerProblem.includes('print')) {
       return {
         title: 'Printer Issue Solution',
         description: 'Most printer problems can be resolved by checking connections and restarting the print service.',
         steps: [
           'Check that your printer is turned on and connected',
           'Verify paper and ink levels',
           'Clear any paper jams',
           'Restart the print spooler service',
           'Try printing a test page'
         ],
         estimatedTime: '5-10 minutes',
         category: 'Hardware'
       };
     }

     // Default solution for general issues
     return {
       title: 'General Troubleshooting Solution',
       description: 'This appears to be a common IT issue that can be resolved with standard troubleshooting steps.',
       steps: [
         'Restart your computer or device',
         'Check for any available software updates',
         'Verify your network connection',
         'Try using the application in safe mode if applicable',
         'Contact IT support if the issue continues'
       ],
       estimatedTime: '10-15 minutes',
       category: 'General'
     };
   };

   // Chat AI Workflow for Text-based Conversations
   const startChatAI = () => {
     setShowChatAIForm(true);
     setChatAIDetails({
       employeeId: '',
       problemStatement: '',
       conversationStage: 'welcome'
     });

     setMessages(prev => [...prev, {
       id: Date.now(),
       type: 'bot',
       content: "💬 **Chat AI Activated!** I'm here to help you resolve your IT issues through our conversation. I'll ask you a few questions to understand your problem and provide the best possible solution.",
       timestamp: new Date(),
       avatar: currentBot?.avatar
     }]);

     // Ask for employee ID
     setTimeout(() => {
       setChatAIDetails(prev => ({ ...prev, conversationStage: 'employeeId' }));
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'bot',
         content: "Let's start by getting your employee ID. Please enter your employee ID:",
         timestamp: new Date(),
         avatar: currentBot?.avatar,
         isChatAIQuestion: true,
         questionType: 'employeeId',
         placeholder: 'Enter your employee ID (e.g., EMP12345)'
       }]);
     }, 1000);
   };

   const handleChatAIAnswer = (questionType, answer) => {
     if (questionType === 'employeeId') {
       setChatAIDetails(prev => ({ 
         ...prev, 
         employeeId: answer,
         conversationStage: 'problem'
       }));

       // Add user message
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'user',
         content: answer,
         timestamp: new Date()
       }]);

       // Ask for problem statement
       setTimeout(() => {
         setMessages(prev => [...prev, {
           id: Date.now(),
           type: 'bot',
           content: `Thank you! I've recorded your employee ID as ${answer}. Now, please describe your IT problem in detail. What specific issue are you experiencing?`,
           timestamp: new Date(),
           avatar: currentBot?.avatar,
           isChatAIQuestion: true,
           questionType: 'problemStatement',
           placeholder: 'Describe your IT problem in detail...',
           isTextarea: true
         }]);
       }, 1500);

     } else if (questionType === 'problemStatement') {
       setChatAIDetails(prev => ({ 
         ...prev, 
         problemStatement: answer,
         conversationStage: 'solution'
       }));

       // Add user message
       setMessages(prev => [...prev, {
         id: Date.now(),
         type: 'user',
         content: answer,
         timestamp: new Date()
       }]);

       // Analyze and provide solution
       setTimeout(() => {
         analyzeChatProblemAndProvideSolution(answer);
       }, 1500);
     }
   };

   const analyzeChatProblemAndProvideSolution = (problemStatement) => {
     setIsTyping(true);

     setTimeout(() => {
       setIsTyping(false);

       const solution = generateChatSolution(problemStatement);
       const analysisResult = analyzeIfSolutionExists(problemStatement);

       if (analysisResult.canSolve) {
         // Provide solution via chat
         setMessages(prev => [...prev, {
           id: Date.now(),
           type: 'bot',
           content: `🎯 **Solution Found!** I've analyzed your problem and found a solution that should help resolve your issue. Here's what I recommend:`,
           timestamp: new Date(),
           avatar: currentBot?.avatar,
           hasChatSolution: true,
           solution: solution
         }]);

         // Follow-up message
         setTimeout(() => {
           setMessages(prev => [...prev, {
             id: Date.now(),
             type: 'bot',
             content: `That should resolve your ${solution.category.toLowerCase()} issue! The estimated time to complete these steps is **${solution.estimatedTime}**. \n\nIs there anything else I can help you with today?`,
             timestamp: new Date(),
             avatar: currentBot?.avatar,
             hasChatAIActions: true,
             actions: [
               { text: 'Ask Another Question', action: 'start-chat-ai' },
               { text: 'Create Ticket Anyway', action: 'general-chat' },
               { text: 'End Conversation', action: 'general-chat' }
             ]
           }]);
         }, 2000);

       } else {
         // Request manual ticket creation
         setMessages(prev => [...prev, {
           id: Date.now(),
           type: 'bot',
           content: `🤔 **Complex Issue Detected** - After analyzing your problem, I've determined that this issue requires specialized attention from our support team.`,
           timestamp: new Date(),
           avatar: currentBot?.avatar,
           hasChatTicketRecommendation: true,
           problemStatement: problemStatement,
           complexity: analysisResult.complexity
         }]);
       }

       setChatAIDetails(prev => ({ ...prev, conversationStage: 'complete' }));
       setShowChatAIForm(false);
     }, 3000);
   };

   const generateChatSolution = (problemStatement) => {
     const lowerProblem = problemStatement.toLowerCase();

     if (lowerProblem.includes('password') || lowerProblem.includes('login') || lowerProblem.includes('forgot')) {
       return {
         title: 'Password Reset & Login Recovery',
         description: 'This appears to be an authentication issue. Password and login problems can typically be resolved through our self-service portal.',
         steps: [
           'Navigate to your organization\'s login page',
           'Look for and click the "Forgot Password" or "Reset Password" link',
           'Enter your employee ID or registered email address',
           'Check your email inbox (and spam folder) for a password reset link',
           'Click the reset link and follow the instructions to create a new password',
           'Ensure your new password meets the security requirements',
           'Try logging in with your new credentials',
           'If you still can\'t access your account, contact the help desk'
         ],
         estimatedTime: '5-10 minutes',
         category: 'Authentication',
         priority: 'Medium',
         successRate: '95%'
       };
     }

     if (lowerProblem.includes('wifi') || lowerProblem.includes('internet') || lowerProblem.includes('connection') || lowerProblem.includes('network')) {
       return {
         title: 'Network Connectivity Troubleshooting',
         description: 'Network connectivity issues can often be resolved through systematic troubleshooting of your connection settings.',
         steps: [
           'Check if your WiFi adapter is enabled and functioning',
           'Verify you\'re connected to the correct network',
           'Try disconnecting and reconnecting to your WiFi network',
           'Restart your network adapter through Device Manager',
           'Move closer to the WiFi router to check signal strength',
           'Run the built-in network troubleshooter on your device',
           'Clear your DNS cache by running "ipconfig /flushdns" in command prompt',
           'Contact your network administrator if the issue persists'
         ],
         estimatedTime: '5-15 minutes',
         category: 'Network',
         priority: 'High',
         successRate: '85%'
       };
     }

     if (lowerProblem.includes('email') || lowerProblem.includes('outlook') || lowerProblem.includes('mail')) {
       return {
         title: 'Email Client Resolution',
         description: 'Email connectivity and synchronization issues can usually be resolved by refreshing your client configuration.',
         steps: [
           'Close your email application completely',
           'Check your internet connection stability',
           'Restart your email client (Outlook, Thunderbird, etc.)',
           'Verify your email server settings are correct',
           'Check if your mailbox storage is approaching the limit',
           'Try accessing your email through the web browser as a test',
           'Run the email client in safe mode to identify add-in conflicts',
           'Contact IT support if you continue experiencing sync issues'
         ],
         estimatedTime: '5-10 minutes',
         category: 'Email',
         priority: 'Medium',
         successRate: '88%'
       };
     }

     if (lowerProblem.includes('slow') || lowerProblem.includes('freeze') || lowerProblem.includes('performance') || lowerProblem.includes('hang')) {
       return {
         title: 'System Performance Optimization',
         description: 'Performance issues are often caused by resource constraints or background processes that can be addressed through system maintenance.',
         steps: [
           'Close any unnecessary applications and browser tabs',
           'Check your available disk space (should have at least 15% free)',
           'Open Task Manager to identify resource-heavy processes',
           'Restart your computer to clear temporary files and reset memory',
           'Run Disk Cleanup to remove temporary files and cache',
           'Check for and install any pending system updates',
           'Disable startup programs that you don\'t need immediately',
           'Consider running a full antivirus scan to check for malware'
         ],
         estimatedTime: '15-30 minutes',
         category: 'Performance',
         priority: 'Medium',
         successRate: '80%'
       };
     }

     if (lowerProblem.includes('printer') || lowerProblem.includes('print') || lowerProblem.includes('printing')) {
       return {
         title: 'Printer Connectivity & Functionality',
         description: 'Most printer problems stem from connectivity issues, driver problems, or print queue blockages that can be systematically resolved.',
         steps: [
           'Verify that your printer is powered on and shows a ready status',
           'Check all cable connections (USB/Ethernet) or WiFi connection',
           'Ensure there\'s sufficient paper and ink/toner in the printer',
           'Clear any paper jams by following your printer\'s instructions',
           'Open Print Queue and cancel any stuck print jobs',
           'Restart the Print Spooler service in Windows Services',
           'Try printing a test page directly from the printer',
           'Reinstall or update printer drivers if the issue persists'
         ],
         estimatedTime: '10-20 minutes',
         category: 'Hardware',
         priority: 'Medium',
         successRate: '90%'
       };
     }

     if (lowerProblem.includes('software') || lowerProblem.includes('application') || lowerProblem.includes('program') || lowerProblem.includes('install')) {
       return {
         title: 'Software Application Support',
         description: 'Software-related issues can often be resolved through proper installation procedures, updates, or configuration adjustments.',
         steps: [
           'Ensure you have administrator rights for software installation',
           'Check if the software is compatible with your operating system',
           'Temporarily disable antivirus software during installation',
           'Download the latest version from the official vendor website',
           'Run the installer as administrator',
           'Restart your computer after installation completes',
           'Check for any available software updates or patches',
           'Contact your software administrator for licensing issues'
         ],
         estimatedTime: '10-25 minutes',
         category: 'Software',
         priority: 'Medium',
         successRate: '85%'
       };
     }

     // Default solution for general issues
     return {
       title: 'General IT Troubleshooting',
       description: 'For general IT issues, we\'ll start with fundamental troubleshooting steps that resolve most common problems.',
       steps: [
         'Document the exact error message or symptoms you\'re experiencing',
         'Note when the problem started and any recent changes to your system',
         'Restart your computer and test if the issue persists',
         'Check for and install any available system updates',
         'Run a full system scan with your antivirus software',
         'Try reproducing the issue in Safe Mode if applicable',
         'Create a backup of important data as a precautionary measure',
         'Contact IT support with detailed information if the issue continues'
       ],
       estimatedTime: '15-30 minutes',
       category: 'General',
       priority: 'Medium',
       successRate: '75%'
     };
   };

 const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "I understand your request. Let me analyze that for you.",
        "That's a great question! Based on my analysis, here's what I recommend:",
        "I can definitely help with that. Let me process the information.",
        "Excellent point! Here's my assessment of the situation:",
        "I've processed your request. Here are my findings and recommendations:"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        content: randomResponse,
        timestamp: new Date(),
        avatar: currentBot?.avatar
      }]);
    }, 1500 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    
    // Handle specific bot interactions
    if (currentBot?.id === 'devops-pipeline' && showPipelineForm) {
      handlePipelineAnswer(inputMessage);
    } else if (currentBot?.id === 'build-automate' && showInfraForm) {
      // Handle infrastructure form responses via text input
      handleInfraAnswer('text-input', inputMessage);
    } else if (currentBot?.id === 'cost-optimization' && showCostOptForm) {
      // Handle cost optimization form responses
      handleCostOptAnswer('text-input', inputMessage);
    } else if (currentBot?.id === 'unix-permission' && showUnixPermForm) {
      // Handle unix permission form responses
      handleUnixPermAnswer('text-input', inputMessage);
    } else if (currentBot?.id === 'change-assist' && showChangeAssistForm) {
      // Handle change assist form responses
      handleChangeAssistAnswer('text-input', inputMessage);
    } else if (currentBot?.id === 'knowledge-assist' && showKnowledgeAssistForm) {
      // Handle knowledge assist form responses
      handleKnowledgeAssistAnswer('ticketNumber', inputMessage);
    } else if (currentBot?.id === 'chat-ai' && showChatAIForm) {
      // Handle chat AI form responses
      const stage = chatAIDetails.conversationStage;
      if (stage === 'employeeId') {
        handleChatAIAnswer('employeeId', inputMessage);
      } else if (stage === 'problem') {
        handleChatAIAnswer('problemStatement', inputMessage);
      }
    } else {
      simulateTyping();
    }
  };

  const handleActionClick = (action) => {
    if (action === 'start-pipeline-creation') {
      startPipelineCreation();
    } else if (action === 'start-infrastructure-creation') {
      startInfrastructureCreation();
    } else if (action === 'start-cost-optimization') {
      startCostOptimization();
    } else if (action === 'start-unix-permission-audit') {
      startUnixPermissionAudit();
    } else if (action === 'start-change-assist') {
      startChangeAssist();
    } else if (action === 'start-knowledge-assist') {
      startKnowledgeAssist();
    } else if (action === 'start-voice-ai') {
      startVoiceAI();
    } else if (action === 'start-voice-conversation') {
      startVoiceConversation();
    } else if (action === 'start-chat-ai') {
      startChatAI();
    } else if (action === 'general-chat') {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        content: 'I have a general question',
        timestamp: new Date()
      }]);
      simulateTyping();
    }
  };

  const handleQuestionResponse = (questionData, answer) => {
    if (currentBot?.id === 'devops-pipeline') {
      handlePipelineAnswer(answer);
    } else if (currentBot?.id === 'build-automate') {
      handleInfraAnswer(questionData.field, answer);
    } else if (currentBot?.id === 'cost-optimization') {
      handleCostOptAnswer(questionData.field, answer);
    } else if (currentBot?.id === 'unix-permission') {
      handleUnixPermAnswer(questionData.field, answer);
    } else if (currentBot?.id === 'change-assist') {
      handleChangeAssistAnswer(questionData.field, answer);
    } else if (currentBot?.id === 'knowledge-assist') {
      handleKnowledgeAssistAnswer(questionData.field, answer);
    } else if (currentBot?.id === 'chat-ai') {
      handleChatAIAnswer(questionData.field, answer);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("Voice input: How can you help me optimize our infrastructure?");
      }, 3000);
    }
  };

  const getSectionBots = (section) => {
    return Object.values(allBots).filter(bot => bot.section === section);
  };

  if (!currentBot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-light-900 via-light-800 to-light-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading AI Assistant...</p>
          </div>
          </div>
  );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-light-900 via-light-800 to-light-900 flex">
      {/* Sidebar */}
    <AnimatePresence>
        {isSidebarOpen && (
        <>
            {/* Sidebar Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
          />
          
            {/* Sidebar Content */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
              className="fixed left-0 top-0 h-full w-80 bg-dark-900/95 backdrop-blur-xl border-r border-white/20 z-50 lg:static lg:z-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                  <img 
                    src="/cognizant-logo.png" 
                    alt="Cognizant Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                    <div>
                      <h2 className="text-lg font-medium gradient-text">Cognizant Autonomous IT Operations Toolkit</h2>
                      <p className="text-xs text-gray-400">Bot Selection</p>
                    </div>
                  </div>
              <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden p-2 glass-button rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Conversation History Button */}
            <div className="mb-6">
              <button
                onClick={() => setShowConversationHistory(!showConversationHistory)}
                className="w-full bg-dark-800/50 hover:bg-dark-700/50 border border-white/20 rounded-lg px-4 py-3 text-left transition-all duration-300 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span className="mr-3">📚</span>
                  <span className="text-white font-medium">Conversation History</span>
                </div>
                <span className="text-gray-400 bg-neon-blue/20 text-xs px-2 py-1 rounded-full">
                  {conversationHistory.length}
                </span>
              </button>
            </div>
            
                {/* Bot Categories */}
                <div className="space-y-6">
                  {['DevOps & IAC', 'Analytics', 'WorkNext', 'NextGen ITOps'].map((section) => (
                    <div key={section}>
                      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                        {section}
                      </h3>
                      <div className="space-y-2">
                        {getSectionBots(section).map((bot) => (
                <Link
                  key={bot.id}
                  to={`/chat/${bot.id}`}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                              currentBot.id === bot.id
                                ? 'bg-gradient-to-r ' + bot.gradient + ' text-white'
                                : 'glass-card hover:bg-white/10'
                            }`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <div className="text-2xl">{bot.avatar}</div>
                  <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{bot.name}</p>
                              <p className="text-xs text-gray-400 truncate">
                                {bot.capabilities[0]}
                              </p>
                  </div>
                </Link>
              ))}
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <header className="bg-light-900/80 backdrop-blur-xl border-b border-white/20 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 glass-button rounded-lg"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              
              <Link
                to="/dashboard"
              className="p-2 glass-button rounded-lg hover:bg-white/20 transition-all duration-300"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </Link>
              
              <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${currentBot.gradient} rounded-xl flex items-center justify-center`}>
                <span className="text-2xl">{currentBot.avatar}</span>
                </div>
                <div>
                <h1 className="text-lg font-medium">{currentBot.name}</h1>
                <p className="text-sm text-gray-400">{currentBot.section}</p>
                </div>
              </div>
            </div>

          <div className="flex items-center space-x-3">
            {currentBot.supportsVoice && (
              <button
                onClick={toggleVoiceMode}
                className={`p-2 glass-button rounded-lg transition-all duration-300 ${
                  isVoiceMode ? 'bg-neon-blue/20 text-neon-blue' : ''
                }`}
              >
                <SpeakerWaveIcon className="w-5 h-5" />
              </button>
            )}

            {/* Export Buttons */}
            {messages.length > 2 && (
              <>
                <button
                  onClick={() => exportConversationAsPDF()}
                  className="p-2 glass-button rounded-lg transition-all duration-300 hover:bg-neon-blue/20"
                  title="Export as PDF"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => exportConversationAsWord()}
                  className="p-2 glass-button rounded-lg transition-all duration-300 hover:bg-neon-green/20"
                  title="Export as Word"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                </button>

                <button
                  onClick={saveConversationToHistory}
                  className="p-2 glass-button rounded-lg transition-all duration-300 hover:bg-yellow-500/20"
                  title="Save Conversation"
                >
                  <span className="text-sm">💾</span>
                </button>
              </>
            )}
              
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-6 h-6">
                  <img 
                    src="/cognizant-logo.png" 
                    alt="Cognizant Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                              <span className="hidden sm:block font-medium gradient-text">Cognizant Autonomous IT Operations Toolkit</span>
              </Link>

              {/* Profile Dropdown */}
              <ProfileDropdown user={user} logout={logout} />
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                      : `bg-gradient-to-br ${currentBot.gradient}`
                  }`}>
                    {message.type === 'user' ? (
                      <UserCircleIcon className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-lg">{message.avatar}</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`glass-card p-4 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-neon-blue/20 to-royal-500/20'
                      : 'bg-white/5'
                  }`}>
                    <p className="text-gray-100 leading-relaxed">{message.content}</p>
                    
                    {/* Action Buttons */}
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {message.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleActionClick(action.action)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                              currentBot?.gradient
                                ? `bg-gradient-to-r ${currentBot.gradient} hover:scale-105 text-white`
                                : 'bg-neon-blue hover:bg-neon-blue/80 text-white'
                            }`}
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Question Input */}
                    {message.isQuestion && (
                      <div className="mt-4">
                        <QuestionInput
                          questionData={message.questionData}
                          onAnswer={(answer) => handleQuestionResponse(message.questionData, answer)}
                        />
                      </div>
                    )}

                    {/* Infrastructure Question Input */}
                    {message.isInfraQuestion && (
                      <div className="mt-4">
                        <InfraQuestionInput
                          questionType={message.questionType}
                          options={message.options}
                          placeholder={message.placeholder}
                          defaultValue={message.defaultValue}
                          onAnswer={(answer) => handleInfraAnswer(message.questionType, answer)}
                        />
          </div>
                    )}

                    {/* Cost Optimization Question Input */}
                    {message.isCostOptQuestion && (
                      <div className="mt-4">
                        <CostOptQuestionInput
                          questionType={message.questionType}
                          options={message.options}
                          onAnswer={(answer) => handleCostOptAnswer(message.questionType, answer)}
                        />
                      </div>
                    )}

                    {/* Cost Optimization Dashboard */}
                    {message.hasDashboard && (
                      <div className="mt-6">
                        <CostOptimizationDashboard data={message.dashboardData} />
                      </div>
                    )}

                    {/* Cost Optimization Recommendations */}
                    {message.hasRecommendations && (
                      <div className="mt-4">
                        <RecommendationsList recommendations={message.recommendations} />
                      </div>
                    )}

                    {/* Unix Permission Question Input */}
                    {message.isUnixPermQuestion && (
                      <div className="mt-4">
                        <UnixPermQuestionInput
                          questionType={message.questionType}
                          options={message.options}
                          placeholder={message.placeholder}
                          onAnswer={(answer) => handleUnixPermAnswer(message.questionType, answer)}
                        />
                      </div>
                    )}

                    {/* Unix Permission Security Report */}
                    {message.hasSecurityReport && (
                      <div className="mt-6">
                        <SecurityReport data={message.reportData} />
                      </div>
                    )}

                    {/* Security Recommendations */}
                    {message.hasSecurityRecommendations && (
                      <div className="mt-4">
                        <SecurityRecommendationsList recommendations={message.recommendations} />
                      </div>
                    )}

                    {/* Infrastructure Configuration Summary */}
                    {message.hasConfigSummary && (
                      <div className="mt-4">
                        <ConfigurationSummary data={message.summaryData} />
                      </div>
                    )}

                    {/* Change Assist Question Input */}
                    {message.isChangeAssistQuestion && (
                      <div className="mt-4">
                        <ChangeAssistQuestionInput
                          questionType={message.questionType}
                          inputType={message.inputType}
                          options={message.options}
                          placeholder={message.placeholder}
                          onAnswer={(answer) => handleChangeAssistAnswer(message.questionType, answer)}
                        />
                      </div>
                    )}

                    {/* Change Request Documents */}
                    {message.hasChangeDocuments && (
                      <div className="mt-6">
                        <ChangeDocuments documents={message.documents} />
                      </div>
                    )}

                    {/* ServiceNow Change Request Details */}
                    {message.hasServiceNowDetails && (
                      <div className="mt-6">
                        <ServiceNowDetails data={message.serviceNowData} />
                      </div>
                    )}

                    {/* Knowledge Assist Question Input */}
                    {message.isKnowledgeAssistQuestion && (
                      <div className="mt-4">
                        <KnowledgeAssistQuestionInput
                          questionType={message.questionType}
                          inputType={message.inputType}
                          placeholder={message.placeholder}
                          onAnswer={(answer) => handleKnowledgeAssistAnswer(message.questionType, answer)}
                        />
                      </div>
                    )}

                    {/* Knowledge Base Articles */}
                    {message.hasKnowledgeBase && (
                      <div className="mt-6">
                        <KnowledgeBaseDisplay 
                          articles={message.knowledgeArticles} 
                          ticketInfo={message.ticketInfo} 
                        />
                      </div>
                    )}

                    {/* Handling Recommendations */}
                    {message.hasHandlingRecommendations && (
                      <div className="mt-6">
                        <HandlingRecommendations recommendations={message.recommendations} />
                      </div>
                    )}

                    {/* Voice AI Controls */}
                    {message.hasVoiceControls && (
                      <div className="mt-4">
                        <VoiceControls 
                          voiceStage={message.voiceStage}
                          isListening={message.isListening}
                          onStartConversation={() => handleActionClick('start-voice-conversation')}
                          onStartListening={() => startListening(message.voiceStage)}
                        />
                      </div>
                    )}

                    {/* Voice Solution Display */}
                    {message.hasVoiceSolution && (
                      <div className="mt-6">
                        <VoiceSolutionDisplay solution={message.solution} />
                      </div>
                    )}

                    {/* Ticket Recommendation */}
                    {message.hasTicketRecommendation && (
                      <div className="mt-6">
                        <TicketRecommendationDisplay problemStatement={message.problemStatement} />
                      </div>
                    )}

                    {/* Chat AI Question Input */}
                    {message.isChatAIQuestion && (
                      <div className="mt-4">
                        <ChatAIQuestionInput
                          questionType={message.questionType}
                          placeholder={message.placeholder}
                          isTextarea={message.isTextarea}
                          onAnswer={(answer) => handleChatAIAnswer(message.questionType, answer)}
                        />
                      </div>
                    )}

                    {/* Chat AI Solution Display */}
                    {message.hasChatSolution && (
                      <div className="mt-6">
                        <ChatSolutionDisplay solution={message.solution} />
                      </div>
                    )}

                    {/* Chat AI Actions */}
                    {message.hasChatAIActions && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleActionClick(action.action)}
                            className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition-all duration-300 text-sm"
                          >
                            {action.text}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Chat AI Ticket Recommendation */}
                    {message.hasChatTicketRecommendation && (
                      <div className="mt-6">
                        <ChatTicketRecommendationDisplay 
                          problemStatement={message.problemStatement}
                          complexity={message.complexity}
                        />
                      </div>
                    )}

                    {/* Stage Question Input */}
                    {message.isStageQuestion && (
                      <div className="mt-4">
                        <StageQuestionInput
                          stageNumber={message.stageNumber}
                          totalStages={message.totalStages}
                          onAnswer={(stageName, stageDescription) => 
                            handleStageDetails(stageName, stageDescription, message.stageNumber, message.totalStages)
                          }
                        />
                      </div>
                    )}

                    {/* Code Blocks */}
                    {message.codeBlocks && (
                      <div className="mt-4 space-y-4">
                        {message.codeBlocks.map((codeBlock, idx) => (
                          <CodeBlock
                            key={idx}
                            title={codeBlock.title}
                            language={codeBlock.language}
                            code={codeBlock.code}
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className={`w-10 h-10 bg-gradient-to-br ${currentBot.gradient} rounded-full flex items-center justify-center`}>
                    <span className="text-lg">{currentBot.avatar}</span>
                  </div>
                  <div className="glass-card p-4 rounded-2xl bg-white/5">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-white/20 p-6 bg-light-900/50 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-end space-x-4">
                {/* Voice Mode Toggle and Listening Button */}
                {currentBot.supportsVoice && isVoiceMode && (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={toggleListening}
                      className={`p-3 rounded-full transition-all duration-300 ${
                        isListening
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                          : 'bg-neon-blue hover:bg-neon-blue/80'
                      }`}
                    >
                      {isListening ? (
                        <StopIcon className="w-5 h-5 text-white" />
                      ) : (
                        <MicrophoneIcon className="w-5 h-5 text-white" />
                      )}
                    </button>
                    {isListening && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-xs text-center text-neon-blue"
                      >
                        Listening...
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Text Input */}
                <div className="flex-1">
                <textarea
                    ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${currentBot.name}...`}
                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none max-h-32"
                  rows="1"
                    style={{
                      minHeight: '24px',
                      height: 'auto',
                    }}
                />
              </div>
              
                {/* Send Button */}
                  <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    inputMessage.trim()
                      ? `bg-gradient-to-r ${currentBot.gradient} hover:scale-105 hover:shadow-lg`
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  <PaperAirplaneIcon className="w-5 h-5 text-white" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Configuration Modal */}
      {showResourceConfigModal && (
        <ResourceConfigModal
          resourceConfig={selectedResourceConfig}
          onSubmit={handleResourceConfigSubmit}
          onClose={() => setShowResourceConfigModal(false)}
        />
      )}

      {/* Conversation History Modal */}
      {showConversationHistory && (
        <ConversationHistoryModal
          conversations={filteredHistory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onLoadConversation={loadConversationFromHistory}
          onExportConversation={exportConversationAsPDF}
          onClearHistory={clearConversationHistory}
          onClose={() => setShowConversationHistory(false)}
        />
      )}
    </div>
  );
};

// Helper Components for DevOps Pipeline Developer
const QuestionInput = ({ questionData, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleOptionClick = (option) => {
    onAnswer(option);
  };

  if (questionData.options) {
    return (
      <div className="flex flex-wrap gap-2">
        {questionData.options.map((option, idx) => (
                <button
            key={idx}
            onClick={() => handleOptionClick(option)}
            className="px-4 py-2 bg-gradient-to-r from-neon-blue to-royal-500 text-white rounded-lg hover:scale-105 transition-all duration-300 text-sm font-medium"
          >
            {option}
                </button>
        ))}
              </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type={questionData.type || 'text'}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={questionData.placeholder}
        className="flex-1 bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none"
        autoFocus
      />
      <button
        type="submit"
        disabled={!answer.trim()}
        className="px-4 py-2 bg-gradient-to-r from-neon-blue to-royal-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
};

const StageQuestionInput = ({ stageNumber, totalStages, onAnswer }) => {
  const [stageName, setStageName] = useState('');
  const [stageDescription, setStageDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stageName.trim() && stageDescription.trim()) {
      onAnswer(stageName.trim(), stageDescription.trim());
      setStageName('');
      setStageDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          placeholder={`Stage ${stageNumber} name (e.g., Build, Test, Deploy)`}
          className="w-full bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none"
          autoFocus
        />
            </div>
      <div>
        <textarea
          value={stageDescription}
          onChange={(e) => setStageDescription(e.target.value)}
          placeholder="What should this stage do?"
          rows="2"
          className="w-full bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={!stageName.trim() || !stageDescription.trim()}
        className="w-full px-4 py-2 bg-gradient-to-r from-neon-blue to-royal-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Add Stage {stageNumber}/{totalStages}
      </button>
    </form>
  );
};

const InfraQuestionInput = ({ questionType, options, placeholder, defaultValue, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleOptionClick = (option) => {
    const value = typeof option === 'object' ? option.value : option;
    onAnswer(value);
  };

  if (options) {
    return (
      <div className="space-y-2">
        {options.map((option, idx) => {
          const displayName = typeof option === 'object' ? option.name : option;
          const isDefault = defaultValue && (typeof option === 'object' ? option.value : option) === defaultValue;
          
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-300 text-sm font-medium ${
                isDefault 
                  ? 'bg-gradient-to-r from-neon-blue to-royal-500 text-white hover:scale-105'
                  : 'bg-dark-800/50 border border-white/20 text-gray-100 hover:bg-white/10 hover:border-neon-blue/50'
              }`}
            >
              {displayName}
              {isDefault && <span className="text-xs opacity-80 ml-2">(Recommended)</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={placeholder || 'Enter your answer...'}
        className="flex-1 bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none"
        autoFocus
      />
      <button
        type="submit"
        disabled={!answer.trim()}
        className="px-4 py-2 bg-gradient-to-r from-neon-blue to-royal-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
};

const CostOptQuestionInput = ({ questionType, options, onAnswer }) => {
  const handleOptionClick = (option) => {
    const value = typeof option === 'object' ? option.value : option;
    onAnswer(value);
  };

  return (
    <div className="space-y-3">
      {options.map((option, idx) => {
        const displayName = typeof option === 'object' ? option.name : option;
        const icon = typeof option === 'object' ? option.icon : '☁️';
        
        return (
          <button
            key={idx}
            onClick={() => handleOptionClick(option)}
            className="w-full px-6 py-4 text-left rounded-lg transition-all duration-300 bg-dark-800/50 border border-white/20 text-gray-100 hover:bg-gradient-to-r hover:from-neon-blue/20 hover:to-royal-500/20 hover:border-neon-blue/50 hover:scale-105 group"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <span className="text-lg font-medium group-hover:text-white transition-colors">
                  {displayName}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const CostOptimizationDashboard = ({ data }) => {
  if (!data) return null;

  const exportDashboard = () => {
    const date = new Date().toLocaleString();
    let content = `COST OPTIMIZATION DASHBOARD EXPORT\n`;
    content += `===================================\n\n`;
    content += `Generated: ${date}\n`;
    content += `Cloud Platform: ${data.cloudPlatform || 'N/A'}\n\n`;
    
    content += `KEY METRICS:\n`;
    content += `============\n`;
    content += `Monthly Cost: $${data.totalMonthlyCost?.toLocaleString()}\n`;
    content += `Potential Savings: $${data.potentialSavings?.toLocaleString()}\n`;
    content += `Optimization Score: ${data.optimizationScore}%\n`;
    content += `Resource Utilization: ${data.resourceUtilization}%\n\n`;

    if (data.costBreakdown) {
      content += `COST BREAKDOWN:\n`;
      content += `===============\n`;
      data.costBreakdown.forEach(item => {
        content += `${item.category}: $${item.cost?.toLocaleString()} (${item.percentage}%)\n`;
      });
      content += `\n`;
    }

    if (data.monthlyTrend) {
      content += `MONTHLY TREND:\n`;
      content += `==============\n`;
      data.monthlyTrend.forEach(month => {
        content += `${month.month}: $${month.cost?.toLocaleString()}\n`;
      });
      content += `\n`;
    }

    if (data.recommendations) {
      content += `RECOMMENDATIONS:\n`;
      content += `================\n`;
      data.recommendations.forEach((rec, index) => {
        content += `${index + 1}. ${rec.title}\n`;
        content += `   Description: ${rec.description}\n`;
        content += `   Potential Savings: ${rec.savings}\n`;
        content += `   Priority: ${rec.priority}\n`;
        content += `   Urgency: ${rec.urgency}\n\n`;
      });
    }

    content += `--- End of Dashboard Export ---\n`;
    content += `Generated by Cognizant Autonomous IT Operations Toolkit\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cost_optimization_dashboard_${new Date().toDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={exportDashboard}
          className="flex items-center space-x-2 px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 rounded-lg transition-colors"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          <span>Export Dashboard</span>
        </button>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monthly Cost"
          value={`$${data.totalMonthlyCost.toLocaleString()}`}
          icon="💰"
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Potential Savings"
          value={`$${data.potentialSavings.toLocaleString()}`}
          icon="💡"
          color="from-green-500 to-green-600"
          highlight={true}
        />
        <MetricCard
          title="Optimization Score"
          value={`${data.optimizationScore}%`}
          icon="⭐"
          color="from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Resource Utilization"
          value={`${data.resourceUtilization}%`}
          icon="📊"
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Cost Breakdown Chart */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Cost Breakdown by Service
        </h3>
        <div className="space-y-4">
          {data.costBreakdown.map((item, index) => (
            <CostBreakdownItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">📉</span>
          Monthly Cost Trend
        </h3>
        <div className="space-y-2">
          {data.monthlyTrend.map((month, index) => (
            <MonthlyTrendBar key={index} month={month} index={index} />
          ))}
        </div>
      </div>

      {/* Resource Efficiency */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Resource Efficiency Analysis
        </h3>
        <div className="space-y-4">
          {data.resourceEfficiency.map((resource, index) => (
            <EfficiencyBar key={index} resource={resource} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, highlight = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`glass-card p-4 rounded-lg ${highlight ? 'ring-2 ring-green-500/50' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${highlight ? 'text-green-400' : 'text-white'}`}>
          {value}
            </p>
          </div>
      <div className={`text-3xl p-3 rounded-lg bg-gradient-to-br ${color}`}>
        {icon}
        </div>
      </div>
  </motion.div>
);

const CostBreakdownItem = ({ item, index }) => {
  const percentage = ((item.cost / (item.cost * 5)) * 100).toFixed(1);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-300 font-medium">{item.name}</span>
        <div className="text-right">
          <span className="text-white font-semibold">${item.cost.toFixed(0)}</span>
          <span className="text-green-400 text-sm ml-2">-${item.savings}</span>
        </div>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className="h-3 rounded-full"
            style={{ backgroundColor: item.color }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const MonthlyTrendBar = ({ month, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="flex items-center space-x-4"
  >
    <span className="text-gray-300 w-12 text-sm">{month.month}</span>
    <div className="flex-1 space-y-1">
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 w-16">Actual</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(month.actual / 12000) * 100}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
          />
        </div>
        <span className="text-white text-sm w-20">${month.actual.toLocaleString()}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400 w-16">Optimized</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(month.predicted / 12000) * 100}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full"
          />
        </div>
        <span className="text-green-400 text-sm w-20">${month.predicted.toLocaleString()}</span>
      </div>
    </div>
  </motion.div>
);

const EfficiencyBar = ({ resource, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="space-y-2"
  >
    <div className="flex justify-between items-center">
      <span className="text-gray-300 font-medium">{resource.name}</span>
      <div className="text-right">
        <span className="text-white">{resource.current}%</span>
        <span className="text-gray-400 text-sm ml-2">/ {resource.target}%</span>
      </div>
    </div>
    <div className="relative">
      <div className="w-full bg-gray-700 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(resource.current / 100) * 100}%` }}
          transition={{ duration: 1, delay: index * 0.2 }}
          className="h-3 rounded-full"
          style={{ backgroundColor: resource.color }}
        />
        <div
          className="absolute top-0 h-3 w-1 bg-white/50 rounded-full"
          style={{ left: `${resource.target}%` }}
        />
      </div>
    </div>
  </motion.div>
);

const RecommendationsList = ({ recommendations }) => (
  <div className="space-y-3">
    {recommendations.map((recommendation, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-dark-800/30 border border-white/10 rounded-lg p-4 hover:bg-dark-800/50 transition-all duration-300"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-gray-100 leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} 
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const UnixPermQuestionInput = ({ questionType, options, placeholder, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer.trim());
      setAnswer('');
    }
  };

  const handleOptionClick = (option) => {
    const value = typeof option === 'object' ? option.value : option;
    onAnswer(value);
  };

  if (options) {
    return (
      <div className="space-y-3">
        {options.map((option, idx) => {
          const displayName = typeof option === 'object' ? option.name : option;
          const icon = typeof option === 'object' ? option.icon : '🖥️';
          
          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className="w-full px-6 py-4 text-left rounded-lg transition-all duration-300 bg-dark-800/50 border border-white/20 text-gray-100 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 hover:border-red-500/50 hover:scale-105 group"
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <span className="text-lg font-medium group-hover:text-white transition-colors">
                    {displayName}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={placeholder || 'Enter server hostname or IP...'}
        className="flex-1 bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-red-500/50 focus:outline-none"
        autoFocus
      />
      <button
        type="submit"
        disabled={!answer.trim()}
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </form>
  );
};

const SecurityReport = ({ data }) => {
  if (!data) return null;

  const downloadReport = () => {
    const reportContent = generateReportContent(data);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${data.serverInfo.hostname}-${data.serverInfo.auditDate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Server Information Header */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <span className="mr-2">🛡️</span>
            Security Audit Report
          </h3>
          <button
            onClick={downloadReport}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:scale-105 transition-all duration-300 text-sm font-medium flex items-center space-x-2"
          >
            <span>📥</span>
            <span>Download Report</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ServerInfoCard title="Server" value={data.serverInfo.hostname} icon="🖥️" />
          <ServerInfoCard title="Cloud Platform" value={data.serverInfo.cloudPlatform} icon="☁️" />
          <ServerInfoCard title="Audit Date" value={data.serverInfo.auditDate} icon="📅" />
          <ServerInfoCard title="Security Score" value={`${data.securityScore}%`} icon="📊" 
            color={data.securityScore >= 80 ? 'text-green-400' : data.securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'} />
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">⚠️</span>
          Risk Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RiskCard title="Critical" count={data.riskDistribution.critical} color="from-red-500 to-red-600" />
          <RiskCard title="High" count={data.riskDistribution.high} color="from-orange-500 to-orange-600" />
          <RiskCard title="Medium" count={data.riskDistribution.medium} color="from-yellow-500 to-yellow-600" />
          <RiskCard title="Low" count={data.riskDistribution.low} color="from-green-500 to-green-600" />
        </div>
      </div>

      {/* Files with 777 Permissions */}
      {data.files777.length > 0 && (
        <div className="bg-dark-900/50 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-red-400 mb-4 flex items-center">
            <span className="mr-2">🚨</span>
            Critical: Files with 777 Permissions ({data.files777.length})
          </h3>
          <div className="space-y-3">
            {data.files777.map((file, index) => (
              <CriticalFileItem key={index} file={file} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Permission Violations */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          Permission Violations ({data.vulnerabilities.length})
        </h3>
        <div className="space-y-3">
          {data.vulnerabilities.map((violation, index) => (
            <ViolationItem key={index} violation={violation} index={index} />
          ))}
        </div>
      </div>

      {/* All Scanned Files */}
      <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Scanned Files Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{data.totalFiles}</div>
            <div className="text-gray-300 text-sm">Total Files Scanned</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{data.scannedDirectories}</div>
            <div className="text-gray-300 text-sm">Directories Analyzed</div>
          </div>
          <div className="text-center p-4 bg-dark-800/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{data.vulnerabilities.length}</div>
            <div className="text-gray-300 text-sm">Vulnerabilities Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServerInfoCard = ({ title, value, icon, color = 'text-white' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-dark-800/50 rounded-lg p-4"
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-gray-400 text-sm">{title}</div>
        <div className={`font-semibold ${color}`}>{value}</div>
      </div>
    </div>
  </motion.div>
);

const RiskCard = ({ title, count, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-gradient-to-br ${color} p-4 rounded-lg text-white`}
  >
    <div className="text-center">
      <div className="text-3xl font-bold">{count}</div>
      <div className="text-sm opacity-90">{title} Risk</div>
    </div>
  </motion.div>
);

const CriticalFileItem = ({ file, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="font-mono text-red-300 font-medium">{file.path}</div>
        <div className="text-gray-400 text-sm mt-1">{file.description}</div>
        <div className="text-gray-400 text-xs mt-2">
          Owner: {file.owner} | Group: {file.group}
        </div>
      </div>
      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
        777
      </div>
    </div>
  </motion.div>
);

const ViolationItem = ({ violation, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`border rounded-lg p-4 ${
      violation.riskLevel === 'Critical' 
        ? 'bg-red-900/20 border-red-500/30' 
        : 'bg-orange-900/20 border-orange-500/30'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="font-mono text-gray-100 font-medium">{violation.path}</div>
        <div className="text-gray-400 text-sm mt-1">{violation.vulnerability}</div>
        <div className="text-gray-400 text-xs mt-2">
          Current: {violation.currentPermissions} → Recommended: {violation.recommendedPermissions}
        </div>
      </div>
      <div className={`px-2 py-1 rounded text-xs font-bold ${
        violation.riskLevel === 'Critical' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
      }`}>
        {violation.riskLevel}
      </div>
    </div>
  </motion.div>
);

const SecurityRecommendationsList = ({ recommendations }) => (
  <div className="space-y-3">
    {recommendations.map((recommendation, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-dark-800/30 border border-white/10 rounded-lg p-4 hover:bg-dark-800/50 transition-all duration-300"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="text-gray-100 leading-relaxed" 
               dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} 
            />
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const ConfigurationSummary = ({ data }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Infrastructure Configuration Summary
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Resource Name</span>
          <div className="text-right">
            <span className="text-white font-semibold">{data.resourceName}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Platform</span>
          <div className="text-right">
            <span className="text-white font-semibold">{data.platform}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Type</span>
          <div className="text-right">
            <span className="text-white font-semibold">{data.type}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Details</span>
          <div className="text-right">
            <span className="text-white font-semibold">{JSON.stringify(data.details)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const generateReportContent = (data) => {
  return `
UNIX FILE PERMISSION SECURITY AUDIT REPORT
==========================================

Server Information:
- Hostname: ${data.serverInfo.hostname}
- Cloud Platform: ${data.serverInfo.cloudPlatform}
- Audit Date: ${data.serverInfo.auditDate}
- Audit Time: ${data.serverInfo.auditTime}
- Security Score: ${data.securityScore}%

Scan Summary:
- Total Files Scanned: ${data.totalFiles}
- Directories Analyzed: ${data.scannedDirectories}
- Vulnerabilities Found: ${data.vulnerabilities.length}

Risk Distribution:
- Critical Risk: ${data.riskDistribution.critical} files
- High Risk: ${data.riskDistribution.high} files  
- Medium Risk: ${data.riskDistribution.medium} files
- Low Risk: ${data.riskDistribution.low} files

CRITICAL FILES WITH 777 PERMISSIONS:
${data.files777.length === 0 ? 'None found' : data.files777.map(file => 
  `- ${file.path} (Owner: ${file.owner}, Group: ${file.group})`
).join('\n')}

PERMISSION VIOLATIONS:
${data.vulnerabilities.map(violation => 
  `- ${violation.path}\n  Current: ${violation.currentPermissions} | Recommended: ${violation.recommendedPermissions}\n  Risk: ${violation.riskLevel} | Issue: ${violation.vulnerability}`
).join('\n\n')}

ALL SCANNED FILES:
${data.criticalFiles.map(file => 
  `- ${file.path} (${file.permissions}) - Owner: ${file.owner}, Group: ${file.group}, Risk: ${file.riskLevel}`
).join('\n')}

Generated by Unix File Permission Agent
Report Date: ${new Date().toISOString()}
`;
};

const CodeBlock = ({ title, language, code }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-dark-800/50 border-b border-white/10">
        <span className="text-sm font-medium text-gray-300">{title}</span>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-xs bg-neon-blue/20 text-neon-blue rounded hover:bg-neon-blue/30 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const ResourceConfigModal = ({ resourceConfig, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    resourceName: '',
    cloudPlatform: resourceConfig?.platform || '',
    instanceType: 't2.micro',
    amiId: 'ami-0c55b159cbfafe1d0',
    keyPair: '',
    securityGroup: 'Create new (default)',
    bucketName: '',
    versioning: 'Enabled',
    encryption: 'AES256',
    publicAccess: 'Yes (Recommended)',
    vmSize: 'Standard_B1s',
    osType: 'Linux',
    adminUsername: 'azureuser',
    machineType: 'e2-micro',
    zone: 'us-central1-a',
    runtime: '',
    functionName: '',
    handler: '',
    timeout: '300'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFieldsForResource = () => {
    const resourceTypes = [
      { name: 'AWS EC2 Instance', value: 'aws-ec2', platform: 'aws', type: 'ec2', fields: ['instanceType', 'amiId', 'keyPair', 'securityGroup'] },
      { name: 'AWS S3 Bucket', value: 'aws-s3', platform: 'aws', type: 's3', fields: ['bucketName', 'versioning', 'encryption', 'publicAccess'] },
      { name: 'AWS Lambda Function', value: 'aws-lambda', platform: 'aws', type: 'lambda', fields: ['runtime', 'functionName', 'handler', 'timeout'] },
      { name: 'Azure Virtual Machine', value: 'azure-vm', platform: 'azure', type: 'vm', fields: ['vmSize', 'osType', 'adminUsername'] },
      { name: 'Azure Storage Account', value: 'azure-storage', platform: 'azure', type: 'storage', fields: ['accountTier', 'replicationType', 'accessTier'] },
      { name: 'GCP Compute Instance', value: 'gcp-compute', platform: 'gcp', type: 'compute', fields: ['machineType', 'zone'] },
      { name: 'GCP Cloud Storage', value: 'gcp-storage', platform: 'gcp', type: 'storage', fields: ['bucketName', 'location', 'storageClass'] }
    ];
    
    const resource = resourceTypes.find(r => r.platform === resourceConfig.platform && r.type === resourceConfig.type);
    return resource ? resource.fields : [];
  };

  const renderField = (fieldName) => {
    const fieldConfigs = {
      instanceType: {
        label: 'Instance Type',
        type: 'select',
        options: ['t2.micro', 't2.small', 't2.medium', 't3.micro', 't3.small']
      },
      amiId: {
        label: 'AMI ID',
        type: 'text',
        placeholder: 'ami-0c55b159cbfafe1d0'
      },
      keyPair: {
        label: 'Key Pair Name',
        type: 'text',
        placeholder: 'my-key-pair'
      },
      securityGroup: {
        label: 'Security Group',
        type: 'radio',
        options: ['Create new (default)', 'Use existing']
      },
      bucketName: {
        label: 'Bucket Name',
        type: 'text',
        placeholder: 'my-unique-bucket-name-123'
      },
      versioning: {
        label: 'Versioning',
        type: 'radio',
        options: ['Enabled', 'Disabled']
      },
      encryption: {
        label: 'Encryption',
        type: 'select',
        options: ['AES256', 'aws:kms', 'Disabled']
      },
      vmSize: {
        label: 'VM Size',
        type: 'select',
        options: ['Standard_B1s', 'Standard_B2s', 'Standard_D2s_v3', 'Standard_F2s_v2']
      },
      osType: {
        label: 'Operating System',
        type: 'radio',
        options: ['Linux', 'Windows']
      },
      machineType: {
        label: 'Machine Type',
        type: 'select',
        options: ['e2-micro', 'e2-small', 'e2-medium', 'n1-standard-1']
      },
      zone: {
        label: 'Zone',
        type: 'select',
        options: ['us-central1-a', 'us-west1-a', 'europe-west1-a']
      },
      runtime: {
        label: 'Runtime',
        type: 'text',
        placeholder: 'nodejs14, python3.9, java11'
      },
      functionName: {
        label: 'Function Name',
        type: 'text',
        placeholder: 'my-lambda-function'
      },
      handler: {
        label: 'Handler',
        type: 'text',
        placeholder: 'index.handler'
      },
      timeout: {
        label: 'Timeout (seconds)',
        type: 'text',
        placeholder: '300'
      }
    };

    const config = fieldConfigs[fieldName] || { label: fieldName, type: 'text' };

    return (
      <div key={fieldName} className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {config.label}
        </label>
        {config.type === 'select' && (
          <select
            value={formData[fieldName]}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white focus:border-neon-blue/50 focus:outline-none"
          >
            {config.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
        {config.type === 'radio' && (
          <div className="space-y-2">
            {config.options.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={formData[fieldName] === option}
                  onChange={(e) => handleInputChange(fieldName, e.target.value)}
                  className="text-neon-blue focus:ring-neon-blue/50"
                />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        )}
        {config.type === 'text' && (
          <input
            type="text"
            value={formData[fieldName]}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            placeholder={config.placeholder}
            className="w-full bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none"
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-900 border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <span className="mr-2">⚙️</span>
            Resource Configuration
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Resource Name
            </label>
            <input
              type="text"
              value={formData.resourceName}
              onChange={(e) => handleInputChange('resourceName', e.target.value)}
              placeholder="Enter resource name"
              className="w-full bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cloud Platform
            </label>
            <input
              type="text"
              value={resourceConfig?.platform?.toUpperCase() || ''}
              readOnly
              className="w-full bg-dark-700/50 border border-white/10 rounded-lg px-4 py-2 text-gray-400"
            />
          </div>

          {getFieldsForResource().map(field => renderField(field))}

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-neon-blue to-royal-500 text-white py-3 px-6 rounded-lg hover:scale-105 transition-all duration-300 font-medium"
            >
              Submit Configuration
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const KnowledgeAssistQuestionInput = ({ questionType, inputType, placeholder, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer('');
    }
  };

  return (
    <div className="bg-dark-800/50 border border-white/20 rounded-lg p-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-dark-700/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none mb-3"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300"
        >
          Analyze Ticket
        </button>
      </form>
    </div>
  );
};

const KnowledgeBaseDisplay = ({ articles, ticketInfo }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">📚</span>
          Knowledge Base Articles
        </h3>
        <div className="text-sm text-gray-400">
          Found {articles.length} relevant articles
        </div>
      </div>
      
      <div className="mb-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">🎫</span>
          Ticket Information
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-400 text-sm">Number</span>
            <div className="text-white font-semibold">{ticketInfo.number}</div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Type</span>
            <div className="text-white font-semibold">{ticketInfo.type}</div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Category</span>
            <div className="text-white font-semibold">{ticketInfo.category}</div>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Priority</span>
            <div className={`font-semibold ${
              ticketInfo.priority === 'Critical' ? 'text-red-400' :
              ticketInfo.priority === 'High' ? 'text-orange-400' :
              ticketInfo.priority === 'Medium' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {ticketInfo.priority}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={article.id} className="bg-dark-800/50 border border-white/10 rounded-lg p-5 hover:border-neon-blue/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-neon-blue font-mono text-sm mr-3">{article.id}</span>
                  <span className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-xs px-2 py-1 rounded-full">
                    {article.relevanceScore}% Match
                  </span>
                </div>
                <h5 className="text-lg font-semibold text-white mb-2">{article.title}</h5>
                <p className="text-gray-300 text-sm leading-relaxed">{article.summary}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-400 mt-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="mr-1">📁</span>
                  {article.category}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">👀</span>
                  {article.viewCount} views
                </span>
              </div>
              <span className="flex items-center">
                <span className="mr-1">🕒</span>
                Updated {article.lastUpdated}
              </span>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-4 py-2 rounded-lg text-sm hover:scale-105 transition-all duration-300">
                View Full Article
              </button>
              <button className="bg-dark-700/50 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
                Mark as Helpful
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-neon-green to-royal-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium">
          Search More Articles
        </button>
      </div>
    </div>
  );
};

const ChatAIQuestionInput = ({ questionType, placeholder, isTextarea, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer('');
    }
  };

  return (
    <div className="bg-dark-800/50 border border-white/20 rounded-lg p-4">
      <form onSubmit={handleSubmit}>
        {isTextarea ? (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-dark-700/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none mb-3 resize-none"
            required
          />
        ) : (
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-dark-700/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none mb-3"
            required
          />
        )}
        <button
          type="submit"
          className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300"
        >
          {questionType === 'employeeId' ? 'Submit ID' : 'Submit Problem'}
        </button>
      </form>
    </div>
  );
};

const ChatSolutionDisplay = ({ solution }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">💡</span>
          {solution.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-neon-green to-royal-500 text-white text-xs px-2 py-1 rounded-full">
            {solution.category}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            solution.priority === 'High' ? 'bg-red-500/20 text-red-400' :
            solution.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-green-500/20 text-green-400'
          }`}>
            {solution.priority} Priority
          </span>
        </div>
      </div>
      
      <div className="mb-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <p className="text-gray-300 mb-4">{solution.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-400">
              <span className="mr-1">⏱️</span>
              Est. Time: {solution.estimatedTime}
            </span>
            <span className="text-gray-400">
              <span className="mr-1">📊</span>
              Success Rate: {solution.successRate}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">📝</span>
          Step-by-Step Instructions
        </h4>
        
        {solution.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-dark-800/50 border border-white/10 rounded-lg hover:border-neon-blue/30 transition-all duration-300">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-300 leading-relaxed">{step}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Additional Resources
        </h4>
        <div className="flex flex-wrap gap-2">
          <button className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-3 py-1.5 rounded-lg text-sm hover:scale-105 transition-all duration-300">
            Print Instructions
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Save Solution
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Contact Support
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Rate Solution
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatTicketRecommendationDisplay = ({ problemStatement, complexity }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${
          complexity === 'high' ? 'from-red-500 to-orange-500' : 'from-orange-500 to-yellow-500'
        } rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Manual Support Ticket Required</h3>
        <p className="text-gray-300">
          {complexity === 'high' 
            ? 'This is a complex technical issue that requires hands-on specialist attention.'
            : 'This issue needs personalized investigation by our support team.'
          }
        </p>
      </div>
      
      <div className="mb-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">🔍</span>
          Your Problem Description
        </h4>
        <div className="bg-dark-700/30 border-l-4 border-neon-blue pl-4 py-2">
          <p className="text-gray-300 italic">"{problemStatement}"</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">🎯</span>
          Recommended Next Steps
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1">
              <h5 className="text-white font-medium mb-1">Create a Support Ticket</h5>
              <p className="text-gray-300 text-sm">Visit the ServiceNow portal or call the IT help desk directly</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1">
              <h5 className="text-white font-medium mb-1">Provide Detailed Information</h5>
              <p className="text-gray-300 text-sm">Include your employee ID, the exact problem description, and any error messages</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1">
              <h5 className="text-white font-medium mb-1">Specialist Assignment</h5>
              <p className="text-gray-300 text-sm">A technical specialist will be assigned to investigate and resolve your issue</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">📞</span>
          Support Contact Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">ServiceNow Portal:</span>
            <div className="text-neon-blue font-medium">portal.company.com</div>
          </div>
          <div>
            <span className="text-gray-400">Help Desk Phone:</span>
            <div className="text-neon-blue font-medium">ext. 4357 (HELP)</div>
          </div>
          <div>
            <span className="text-gray-400">Email Support:</span>
            <div className="text-neon-blue font-medium">support@company.com</div>
          </div>
          <div>
            <span className="text-gray-400">Priority Level:</span>
            <div className={`font-medium ${
              complexity === 'high' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {complexity === 'high' ? 'High Priority' : 'Medium Priority'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-neon-green to-royal-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium">
          Open ServiceNow Portal
        </button>
      </div>
    </div>
  );
};

const VoiceControls = ({ voiceStage, isListening, onStartConversation, onStartListening }) => {
  return (
    <div className="bg-dark-800/50 border border-white/20 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-white flex items-center">
          <span className="mr-2">🎤</span>
          Voice AI Controls
        </h4>
        <div className="flex items-center space-x-2">
          {isListening && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-400 text-sm font-medium">Listening...</span>
            </div>
          )}
        </div>
      </div>
      
      {voiceStage === 'welcome' && (
        <div className="text-center">
          <p className="text-gray-300 mb-4">Ready to start your voice conversation? Make sure your microphone is enabled.</p>
          <button
            onClick={onStartConversation}
            className="bg-gradient-to-r from-neon-green to-royal-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium flex items-center mx-auto"
          >
            <span className="mr-2">🎤</span>
            Start Voice Conversation
          </button>
        </div>
      )}
      
      {(voiceStage === 'employeeId' || voiceStage === 'problem') && (
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-royal-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🎤</span>
            </div>
            <p className="text-gray-300">
              {voiceStage === 'employeeId' ? 'Speak your Employee ID clearly' : 'Describe your IT problem in detail'}
            </p>
          </div>
          
                     {isListening ? (
             <div className="flex items-center justify-center space-x-3">
               <div className="w-4 h-4 bg-red-500 rounded-full voice-pulse"></div>
               <span className="text-red-400 font-medium">Listening... Speak now</span>
               <div className="w-4 h-4 bg-red-500 rounded-full voice-pulse"></div>
             </div>
           ) : (
             <button
               onClick={() => onStartListening()}
               className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium flex items-center mx-auto microphone-glow"
             >
               <span className="mr-2">🔴</span>
               Click to Speak
             </button>
           )}
        </div>
      )}
      
      {voiceStage === 'complete' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-royal-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-gray-300">Voice conversation completed! Check the solution above.</p>
        </div>
      )}
      
      {voiceStage === 'ticket' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-gray-300">Please create a manual ticket for specialized support.</p>
        </div>
      )}
    </div>
  );
};

const VoiceSolutionDisplay = ({ solution }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">🔊</span>
          Voice Solution Provided
        </h3>
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-neon-green to-royal-500 text-white text-xs px-2 py-1 rounded-full">
            {solution.category}
          </span>
          <span className="text-gray-400 text-sm">Est. {solution.estimatedTime}</span>
        </div>
      </div>
      
      <div className="mb-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-2">{solution.title}</h4>
        <p className="text-gray-300">{solution.description}</p>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">📝</span>
          Step-by-Step Solution
        </h4>
        
        {solution.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-300 leading-relaxed">{step}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Additional Help
        </h4>
        <div className="flex flex-wrap gap-2">
          <button className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-3 py-1.5 rounded-lg text-sm hover:scale-105 transition-all duration-300">
            Repeat Solution
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Create Ticket Anyway
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

const TicketRecommendationDisplay = ({ problemStatement }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Manual Ticket Required</h3>
        <p className="text-gray-300">This issue requires specialized attention from our support team.</p>
      </div>
      
      <div className="mb-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">🔍</span>
          Your Problem Statement
        </h4>
        <p className="text-gray-300 italic">"{problemStatement}"</p>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Next Steps
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1">
              <p className="text-gray-300">Visit the ServiceNow portal or contact the IT help desk</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1">
              <p className="text-gray-300">Provide your employee ID and detailed problem description</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1">
              <p className="text-gray-300">A specialist will be assigned to investigate and resolve your issue</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-neon-green to-royal-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium">
          Open ServiceNow Portal
        </button>
      </div>
    </div>
  );
};

const HandlingRecommendations = ({ recommendations }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        Recommended Handling Steps
      </h3>
      
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-dark-800/50 border border-white/10 rounded-lg hover:border-neon-blue/30 transition-all duration-300">
            <div className="bg-gradient-to-r from-neon-blue to-royal-500 text-white text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: recommendation.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}></p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Additional Resources
        </h4>
        <div className="flex flex-wrap gap-2">
          <button className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-3 py-1.5 rounded-lg text-sm hover:scale-105 transition-all duration-300">
            ServiceNow Documentation
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Escalation Procedures
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            SLA Guidelines
          </button>
          <button className="bg-dark-700/50 text-gray-300 px-3 py-1.5 rounded-lg text-sm hover:bg-dark-600/50 transition-colors">
            Team Contacts
          </button>
        </div>
      </div>
    </div>
  );
};

const ChangeAssistQuestionInput = ({ questionType, inputType, options, placeholder, onAnswer }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim()) {
      onAnswer(answer);
      setAnswer('');
    }
  };

  const handleOptionClick = (option) => {
    onAnswer(option);
  };

  return (
    <div className="bg-dark-800/50 border border-white/20 rounded-lg p-4">
      {inputType === 'select' && options && (
        <div className="space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="w-full text-left bg-dark-700/50 hover:bg-dark-600/50 border border-white/10 hover:border-neon-blue/50 rounded-lg px-4 py-3 text-white transition-all duration-300 hover:scale-[1.02]"
            >
              {option}
            </button>
          ))}
        </div>
      )}
      
      {inputType === 'text' && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-dark-700/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none mb-3"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      )}
      
      {inputType === 'textarea' && (
        <form onSubmit={handleSubmit}>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-dark-700/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none mb-3 resize-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-neon-blue to-royal-500 text-white px-6 py-2 rounded-lg hover:scale-105 transition-all duration-300"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

const ChangeDocuments = ({ documents }) => {
  const downloadDocument = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllDocuments = () => {
    const allContent = `${documents.changePlan}

${documents.rollbackPlan}

${documents.testPlan}

${documents.impactAnalysis}`;
    
    downloadDocument(allContent, `ServiceNow_Change_Request_${documents.changeRequestNumber}_Complete_Package.txt`);
  };

  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">📋</span>
          ServiceNow Change Request Documents
        </h3>
        <span className="text-sm text-gray-400">CR: {documents.changeRequestNumber}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-800/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-white flex items-center">
              <span className="mr-2">📝</span>
              Change Plan
            </h4>
            <button
              onClick={() => downloadDocument(documents.changePlan, `Change_Plan_${documents.changeRequestNumber}.txt`)}
              className="text-neon-blue hover:text-neon-green transition-colors"
              title="Download Change Plan"
            >
              ⬇️
            </button>
          </div>
          <p className="text-gray-300 text-sm">Comprehensive implementation plan with step-by-step procedures and resource requirements.</p>
        </div>
        
        <div className="bg-dark-800/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-white flex items-center">
              <span className="mr-2">🔄</span>
              Rollback Plan
            </h4>
            <button
              onClick={() => downloadDocument(documents.rollbackPlan, `Rollback_Plan_${documents.changeRequestNumber}.txt`)}
              className="text-neon-blue hover:text-neon-green transition-colors"
              title="Download Rollback Plan"
            >
              ⬇️
            </button>
          </div>
          <p className="text-gray-300 text-sm">Emergency procedures for reverting changes if issues arise during implementation.</p>
        </div>
        
        <div className="bg-dark-800/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-white flex items-center">
              <span className="mr-2">🧪</span>
              Test Plan
            </h4>
            <button
              onClick={() => downloadDocument(documents.testPlan, `Test_Plan_${documents.changeRequestNumber}.txt`)}
              className="text-neon-blue hover:text-neon-green transition-colors"
              title="Download Test Plan"
            >
              ⬇️
            </button>
          </div>
          <p className="text-gray-300 text-sm">Validation procedures to ensure change success and system functionality.</p>
        </div>
        
        <div className="bg-dark-800/50 border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-white flex items-center">
              <span className="mr-2">📊</span>
              Impact Analysis
            </h4>
            <button
              onClick={() => downloadDocument(documents.impactAnalysis, `Impact_Analysis_${documents.changeRequestNumber}.txt`)}
              className="text-neon-blue hover:text-neon-green transition-colors"
              title="Download Impact Analysis"
            >
              ⬇️
            </button>
          </div>
          <p className="text-gray-300 text-sm">Comprehensive analysis of business and technical impact, risks, and mitigation strategies.</p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={downloadAllDocuments}
          className="bg-gradient-to-r from-neon-green to-royal-500 text-white px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium flex items-center"
        >
          <span className="mr-2">📦</span>
          Download Complete Package
        </button>
      </div>
    </div>
  );
};

const ServiceNowDetails = ({ data }) => {
  return (
    <div className="bg-dark-900/50 border border-white/10 rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-white mb-2 flex items-center justify-center">
          <span className="mr-2">✅</span>
          ServiceNow Change Request Created
        </h3>
        <div className="bg-gradient-to-r from-neon-green to-royal-500 text-white text-xl font-bold py-2 px-4 rounded-lg inline-block">
          {data.changeRequestNumber}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Status</span>
            <span className="text-neon-green font-semibold">{data.status}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">State</span>
            <span className="text-white font-semibold">{data.state}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Priority</span>
            <span className={`font-semibold ${
              data.priority === 'Critical' ? 'text-red-400' :
              data.priority === 'High' ? 'text-orange-400' :
              data.priority === 'Medium' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {data.priority}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Risk Level</span>
            <span className={`font-semibold ${
              data.riskLevel === 'High' ? 'text-red-400' :
              data.riskLevel === 'Medium' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {data.riskLevel}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Configuration Item</span>
            <span className="text-white font-semibold">{data.ciName}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Requested By</span>
            <span className="text-white font-semibold">{data.requestedBy}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Assigned To</span>
            <span className="text-white font-semibold">{data.assignedTo}</span>
          </div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <span className="text-gray-300 font-medium">Approval Required</span>
            <span className="text-neon-blue font-semibold">{data.approvalRequired}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-dark-800/50 border border-white/10 rounded-lg p-4">
        <h4 className="text-lg font-medium text-white mb-3 flex items-center">
          <span className="mr-2">📅</span>
          Change Window
        </h4>
        <p className="text-gray-300">{data.changeWindow}</p>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Created on {data.createdDate} at {data.createdTime}
        </div>
      </div>
    </div>
  );
};

const ConversationHistoryModal = ({ 
  conversations, 
  searchTerm, 
  onSearchChange, 
  onLoadConversation, 
  onExportConversation, 
  onClearHistory, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-900 border border-white/20 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <span className="mr-2">📚</span>
            Conversation History
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-gray-400 text-sm">{conversations.length} conversations</span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search conversations by bot name or content..."
            className="w-full bg-dark-800/50 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-neon-blue/50 focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        {conversations.length > 0 && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                onClick={onClearHistory}
                className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                Clear All History
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Click any conversation to load it
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Conversations Yet</h3>
              <p className="text-gray-400">Start chatting with any bot to build your conversation history.</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-dark-800/50 border border-white/10 rounded-lg p-4 hover:border-neon-blue/30 transition-all duration-300 cursor-pointer"
                onClick={() => onLoadConversation(conversation)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{conversation.botAvatar}</div>
                    <div>
                      <h3 className="text-white font-medium">{conversation.botName}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(conversation.timestamp).toLocaleDateString()} at{' '}
                        {new Date(conversation.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-xs bg-dark-700/50 px-2 py-1 rounded">
                      {conversation.messageCount} messages
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportConversation(conversation);
                      }}
                      className="p-1.5 bg-dark-700/50 hover:bg-neon-blue/20 rounded transition-colors"
                      title="Export Conversation"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 text-gray-400 hover:text-neon-blue" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-dark-700/30 border-l-4 border-neon-blue/50 pl-3 py-2">
                  <p className="text-gray-300 text-sm italic">{conversation.preview}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {conversations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Conversations are automatically saved locally and limited to the last 50 sessions.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ChatbotPage; 