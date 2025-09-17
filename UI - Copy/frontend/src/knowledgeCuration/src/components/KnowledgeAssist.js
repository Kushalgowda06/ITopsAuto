import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsShieldFillCheck, BsShieldFillExclamation } from "react-icons/bs";
// import Navbar from './'
import {
  HiLightBulb,
  HiDocumentDuplicate,
  HiChartBarSquare,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiDocumentText,
  HiExclamationTriangle,
  HiPlus,
  HiGlobeAlt,
  HiCircleStack,
  HiCog6Tooth,
  HiShieldCheck,
  HiCloud,
  HiCalendarDays,
  HiUser,
  HiClipboardDocumentList,
  HiMagnifyingGlass,
  HiAdjustmentsHorizontal,
  HiArrowsUpDown,
  HiFunnel,
  HiXMark,
  HiArrowsPointingIn
} from 'react-icons/hi2';
import { FaWindows, FaLinux, FaAws, FaMicrosoft, FaCloud, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { SiGooglecloud } from 'react-icons/si';

// Utility functions for HTML conversion
const htmlToText = (html) => {
  if (!html) return '';

  let text = html;

  // Handle complete HTML documents
  if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
    // Extract title
    const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/si);
    const extractedTitle = titleMatch ? titleMatch[1].trim() : '';

    // Extract body content and ignore head/style/script
    const bodyMatch = text.match(/<body[^>]*>(.*?)<\/body>/si);
    if (bodyMatch) {
      text = bodyMatch[1];
    }

    // Remove script and style tags completely
    text = text.replace(/<script[^>]*>.*?<\/script>/gsi, '');
    text = text.replace(/<style[^>]*>.*?<\/style>/gsi, '');
    text = text.replace(/<link[^>]*>/gsi, '');
    text = text.replace(/<meta[^>]*>/gsi, '');

    // Add title at the beginning if extracted
    if (extractedTitle) {
      text = `=== ${extractedTitle} ===\n\n${text}`;
    }
  }

  // Convert HTML to readable text format
  text = text
    // Convert headings first (most specific to least specific)
    .replace(/<h1[^>]*>(.*?)<\/h1>/gsi, '\n\n=== $1 ===\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gsi, '\n\n## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gsi, '\n\n### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gsi, '\n\n#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gsi, '\n\n##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gsi, '\n\n###### $1\n\n')

    // Convert lists (preserve structure)
    .replace(/<ol[^>]*>/gsi, '\n')
    .replace(/<\/ol>/gsi, '\n')
    .replace(/<ul[^>]*>/gsi, '\n')
    .replace(/<\/ul>/gsi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gsi, '• $1\n')

    // Convert paragraphs and divs
    .replace(/<p[^>]*>(.*?)<\/p>/gsi, '\n\n$1\n\n')
    .replace(/<div[^>]*>(.*?)<\/div>/gsi, '\n$1\n')

    // Convert emphasis
    .replace(/<strong[^>]*>(.*?)<\/strong>/gsi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gsi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gsi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gsi, '*$1*')

    // Convert line breaks
    .replace(/<br\s*\/?>/gsi, '\n')

    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')

    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')

    // Clean up whitespace
    .replace(/[ \t]+/g, ' ')           // Multiple spaces/tabs to single space
    .replace(/\n[ \t]+/g, '\n')       // Remove leading spaces on lines
    .replace(/[ \t]+\n/g, '\n')       // Remove trailing spaces on lines
    .replace(/\n{3,}/g, '\n\n')       // Multiple line breaks to double
    .replace(/^\s+|\s+$/g, '');       // Trim start and end

  return text;
};

const textToHtml = (text) => {
  if (!text) return '';

  // Split text into lines for better processing
  const lines = text.split('\n');
  const htmlLines = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      // Empty line - close list if open, add spacing
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push('');
      continue;
    }

    // Handle headings
    if (line.startsWith('=== ') && line.endsWith(' ===')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      const title = line.slice(4, -4).trim();
      htmlLines.push(`<h1>${title}</h1>`);
    } else if (line.startsWith('## ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h2>${line.slice(3).trim()}</h2>`);
    } else if (line.startsWith('### ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h3>${line.slice(4).trim()}</h3>`);
    } else if (line.startsWith('#### ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h4>${line.slice(5).trim()}</h4>`);
    } else if (line.startsWith('##### ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h5>${line.slice(6).trim()}</h5>`);
    } else if (line.startsWith('###### ')) {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      htmlLines.push(`<h6>${line.slice(7).trim()}</h6>`);
    }
    // Handle bullet points
    else if (line.startsWith('• ')) {
      if (!inList) {
        htmlLines.push('<ul>');
        inList = true;
      }
      const listContent = line.slice(2).trim();
      // Apply inline formatting
      const formattedContent = listContent
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      htmlLines.push(`<li>${formattedContent}</li>`);
    }
    // Handle regular paragraphs
    else {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
      }
      // Apply inline formatting
      const formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      htmlLines.push(`<p>${formattedLine}</p>`);
    }
  }

  // Close any open list
  if (inList) {
    htmlLines.push('</ul>');
  }

  return htmlLines.join('\n');
};

// Icon mapping function (same as Dashboard)
const getIconComponent = (iconName) => {
  const iconMap = {
    'FaWindows': FaWindows,
    'FaLinux': FaLinux,
    'HiGlobeAlt': HiGlobeAlt, // Network
    'HiCircleStack': HiCircleStack, // Database 
    'HiCog6Tooth': HiCog6Tooth, // Services
    'FaAws': FaAws,
    'FaMicrosoft': FaMicrosoft,
    'FaCloud': FaCloud,
    'SiGooglecloud': SiGooglecloud,
    'HiShieldCheck': HiShieldCheck, // Security
    'HiCloud': HiCloud
  };

  const IconComponent = iconMap[iconName];
  return IconComponent ? <IconComponent /> : <HiLightBulb />;
};

const KnowledgeAssist = ({ categories = [], onCategoryClick , updateSOPs }) => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showSOPDetailModal, setShowSOPDetailModal] = useState(false);
  const [showMergedSOPModal, setShowMergedSOPModal] = useState(false);
  const [showMergedListModal, setShowMergedListModal] = useState(false);
  const [showLowScoringModal, setShowLowScoringModal] = useState(false);
  const [showLowScoringDetailModal, setShowLowScoringDetailModal] = useState(false);
  const [showRefinedArticleModal, setShowRefinedArticleModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState(null);
  const [selectedLowScoringArticle, setSelectedLowScoringArticle] = useState(null);
  const [mergedSOP, setMergedSOP] = useState(null);
  const [isEditingMergedSOP, setIsEditingMergedSOP] = useState(false);
  const [editableMergedSOP, setEditableMergedSOP] = useState(null);
  const [refinedArticle, setRefinedArticle] = useState(null);
  const [isEditingRefinedArticle, setIsEditingRefinedArticle] = useState(false);
  const [editableRefinedArticle, setEditableRefinedArticle] = useState(null);
  const [editableCreatedArticle, setEditableCreatedArticle] = useState(null);
  const [isEditingCreatedArticle, setIsEditingCreatedArticle] = useState(null)
  const [propsCategory, setPropsCategory] = useState([...categories])

  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationStatus, setConfirmationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedSOPs, setMergedSOPs] = useState([
    {
      id: 'KB0010318',
      title: 'Comprehensive Guide to Fix High Disk Usage in Windows Caused by Search Indexing and SysMain',
      content: 'Issue Summary:\n High disk usage in Windows can significantly degrade system performance. Two common culprits are Windows Search Indexing and SysMain (Superfetch) services, which run in the background to optimize user experience but may overwhelm systems with limited resources.\n Symptoms:\n • Disk usage near 100% in Task Manager.\n • System lag, slow boot times, and overheating.\n • Unresponsive applications.\n Root Causes:\n • Windows Search Indexing scans files to improve search speed.\n • SysMain (Superfetch) preloads frequently used apps into memory.\n Unified Resolution Steps:\n 1. Disable Windows Search Indexing\n • Open Run (Win + R) > type services.msc.\n • Locate Windows Search > Right-click > Properties.\n • Set Startup type to Disabled > Click Stop.\n 2. Disable SysMain (Superfetch)\n • In the same Services window, locate SysMain.\n • Right-click > Properties > Set Startup type to Disabled > Click Stop.\n 3. Modify Indexing Options\n • Go to Control Panel > Indexing Options.\n • Click Modify > Uncheck folders that don’t need indexing.\n 4. Monitor System Performance\n • Use Task Manager to observe disk usage.\n • Reboot and test responsiveness.\n 5. Optional Hardware Upgrade\n • Upgrade to SSD for better disk I/O performance.\n • Increase RAM to reduce reliance on disk caching.\n Additional Notes:\n • Disabling these services may slightly impact search and app launch speed but improves overall system responsiveness.\n • Re-enable services if needed for specific use cases.\n',
      category: 'Windows Administration',
      author: 'Anish Bhandiwad',
      dateCreated: '2025-08-19',
      views: 434,
      rating: '4.2',
      mergedFrom: 2,
      mergedDate: '2025-08-19',
    },
    {
      id: 'KB0010321',
      title: 'Comprehensive Guide to Resolving SQL Server Performance Issues Due to Missing Indexes and Inefficient Queries',
      content: 'Issue Summary:\n SQL Server performance can degrade due to two closely related issues: missing indexes and inefficient query design. These problems often coexist and compound each other, leading to slow response times and high resource consumption.\n Symptoms:\n • Slow query execution.\n • High CPU and memory usage.\n • Application timeouts or deadlocks.\n • Full table scans in execution plans.\n Root Causes:\n • Lack of indexes on frequently accessed columns.\n • Poor query structure (e.g., unnecessary joins, SELECT *, lack of filtering).\n • Inefficient use of SQL Server’s query optimizer.\n Unified Resolution Steps:\n 1. Identify Missing Indexes\n • Run:\n • SELECT * FROM sys.dm_db_missing_index_details;\n • Review recommendations and usage stats.\n 2. Analyze Query Execution Plans\n • Use SSMS to view graphical execution plans.\n • Look for table scans, key lookups, and expensive joins.\n 3. Create and Tune Indexes\n • Add non-clustered indexes on columns used in WHERE, JOIN, and ORDER BY clauses.\n • Avoid over-indexing to prevent write performance degradation.\n 4. Refactor Inefficient Queries\n • Replace SELECT * with specific columns.\n • Use indexed columns in filters.\n • Avoid nested subqueries when joins suffice.\n 5. Apply Query Hints (Advanced)\n • Use hints like OPTION (RECOMPILE) or FORCESEEK where appropriate.\n 6. Monitor and Benchmark\n • Use SQL Profiler, Extended Events, or Query Store to track performance improvements.\n Additional Notes:\n • Always test changes in a staging environment before applying to production.\n • Regularly review query performance and indexing strategy as data grows.\n',
      author: 'Anish Bhandiwad',
      category: 'Database',
      dateCreated: '2025-08-19',
      views: 590,
      rating: '4.4',
      mergedFrom: 2,
      mergedDate: '2025-08-19'
    },
    {
      id: 1003,
      title: 'Linux Network Interface Troubleshooting - eth0 Down',
      category: 'Linux',
      content: `Introduction
This knowledge article provides a step-by-step guide to troubleshoot and resolve the issue when the network interface eth0 is down. This is a common issue that can affect network connectivity on a Linux-based system.

Prerequisites
Basic knowledge of Linux command line.
Access to the terminal with root or sudo privileges.

Step 1: Check the Status of the Interface
First, we need to verify the status of the eth0 interface.
ip addr show eth0

Example Output:
2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500 qdisc pfifo_fast state DOWN group default qlen 1000
Explanation: state DOWN indicates that the interface is currently down.

Step 2: Bring the Interface Up
If the interface is down, you can bring it up using the following command.
sudo ip link set eth0 up
No output is expected if the command is successful.

Step 3: Verify the Interface Status Again
After attempting to bring the interface up, check its status again to confirm.
ip addr show eth0

Example Output:
Explanation: If you see state UP, the interface is now active.

Step 4: Check for Errors in the Interface
If the interface does not come up, you may want to check for errors.
dmesg | grep eth0

Example Output:
[    1.234567] eth0: link is not ready

Step 5: Check Network Configuration
Example Configuration (Debian/Ubuntu):
auto eth0
iface eth0 inet dhcp

Example Configuration (RHEL/CentOS):
DEVICE=eth0
Edit the configuration file if necessary and restart the networking service.

Step 6: Check Physical Connections
Ensure the network cable is securely connected.
If applicable, check the status of the switch port to which the server is connected.

Step 7: Examine Firewall and Security Settings
Ensure that your firewall allows traffic on eth0.
Review the firewall rules to ensure they are not preventing the interface from operating correctly.

Step 8: Check for Driver Issues
If problems persist, the network driver may be the issue. Check if the correct driver is loaded for your network card.
lspci -k | grep -A 3 -i ethernet

Example Output:
02:00.0 Ethernet controller: Intel Corporation 82574L Gigabit Network Connection
    Subsystem: Intel Corporation Device 0000
    Kernel driver in use: e1000e
If no driver is loaded, you may need to install the appropriate driver.

Step 9: Reboot the System

Conclusion
Following these steps should help you diagnose and resolve the issue of the eth0 interface being down. If the problem persists after performing all these checks and actions, consider seeking further assistance from your network administrator or contacting technical support.`,
      author: 'Anish Bhandiwad',
      rating: "4.6",
      views: 112,
      dateCreated: '2025-08-19',
      mergedFrom: 2,
      mergedDate: '2025-08-19'
    }
  ]);

  // State for managing duplicate articles (will be initialized with default data)
  const [duplicateArticlesState, setDuplicateArticlesState] = useState([]);
  const [savingCreatedKbArtilce, setSavingCreatedKbArtilce] = useState(false)


  function cleanHtml(rawHtml) {
    // Decode HTML entities manually
    const textArea = document.createElement('textarea');
    textArea.innerHTML = rawHtml;
    const decoded = textArea.value;

    // Remove <style>...</style> tags using regex
    const withoutStyles = decoded.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return withoutStyles;
  }


  // State for managing low scoring articles (will be initialized with default data)
  const [lowScoringArticlesState, setLowScoringArticlesState] = useState([]);

  const [newSOP, setNewSOP] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    tags: '',
    steps: ''
  });

  // Table filtering, sorting, and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('dateReported');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    category: '',
    slaStatus: '',
    assignedTo: ''
  });

  const [createdKbArticle, setCreatedKbArticle] = useState()
  const handleCategoryClick = (category) => {
    console.log('Navigating to category:', category.name, 'with ID:', category.id);

    // Call parent's onCategoryClick to update selectedCategory state
    if (onCategoryClick) {
      onCategoryClick(category);
    }

    // Navigate to the category page
    navigate(`/category/${category.id}`);
  };

  const handleCreateDoc = (issueDescription) => {
    setNewSOP({
      ...newSOP,
      title: `SOP for ${issueDescription}`,
      description: `Standard Operating Procedure for resolving ${issueDescription}`
    });
    setShowAddModal(true);
  };

  const handleSaveNewSOP = () => {
    console.log('Creating new SOP:', newSOP);
    setShowAddModal(false);
    setNewSOP({ title: '', description: '', category: '', priority: 'Medium', tags: '', steps: '' });
  };

  const handleDuplicateCardClick = () => {
    setShowDuplicateModal(true);
  };

  const handleMergedCardClick = () => {
    setShowMergedListModal(true);
  };

  const handleLowScoringCardClick = () => {
    setShowLowScoringModal(true);
  };

  const handleLowScoringArticleClick = (article) => {
    setSelectedLowScoringArticle(article);
    setShowLowScoringDetailModal(true);
  };

  const handleSOPClick = (sop) => {
    setSelectedSOP(sop);
    setShowSOPDetailModal(true);
  };

  const handleEditMergedSOP = () => {
    // Convert HTML content to readable text for editing
    const textContent = htmlToText(mergedSOP.htmlContent || mergedSOP.content);
    setEditableMergedSOP({
      ...mergedSOP,
      content: textContent,
      editableTextContent: textContent
    });
    setIsEditingMergedSOP(true);
  };

  const handleSaveEditedSOP = () => {
    // Convert the edited text back to HTML format
    const htmlContent = textToHtml(editableMergedSOP.editableTextContent || editableMergedSOP.content);
    const updatedSOP = {
      ...editableMergedSOP,
      content: editableMergedSOP.editableTextContent || editableMergedSOP.content,
      htmlContent: htmlContent
    };
    setMergedSOP(updatedSOP);
    setIsEditingMergedSOP(false);
  };

  const handleCancelEdit = () => {
    setEditableMergedSOP({ ...mergedSOP });
    setIsEditingMergedSOP(false);
  };

  const handleEditableSOPChange = (field, value) => {
    setEditableMergedSOP(prev => ({
      ...prev,
      [field]: value,
      // Store the editable text content separately
      ...(field === 'content' && { editableTextContent: value })
    }));
  };

  // API Functions
  const callMergeKBArticlesAPI = async (kbArticle1, kbArticle2) => {
    try {
      setIsLoading(true);
      const apiUserName = 'rest'
      const apiPass = '!fi$5*4KlHDdRwdbup%ix'
      // const response = await fetch('http://172.31.6.97:6500/llm/api/v1/merge_kb_articles/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     kb_article_1: kbArticle1,
      //     kb_article_2: kbArticle2
      //   }),
      //   auth: {
      //     username: apiUserName,
      //     password: apiPass
      //   }
      // });


      const response = await axios.post(
        'http://172.31.6.97:6500/llm/api/v1/merge_kb_articles/',
        {
          kb_article_1: kbArticle1,
          kb_article_2: kbArticle2
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          auth: {
            username: apiUserName,
            password: apiPass
          }
        }
      );


      const data = await response.data;
      return data;
    } catch (error) {
      console.error('Error calling merge API:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const callStoreKBArticlesAPI = async (kbArticle) => {
    try {
      setIsLoading(true);
      const apiUserName = 'rest'
      const apiPass = '!fi$5*4KlHDdRwdbup%ix'
      // const response = await fetch('http://172.31.6.97:6500/llm_generated/api/v1/store_kb_articles/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     kb_article: kbArticle
      //   }),
      //   auth: {
      //     username: apiUserName,
      //     password: apiPass
      //   }
      // });

      const response = await axios.post(
        'http://172.31.6.97:6500/llm_generated/api/v1/store_kb_articles/',
        {
          kb_article: kbArticle
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          auth: {
            username: apiUserName,
            password: apiPass
          }
        }
      );

      const data = await response.data;
      return data;
    } catch (error) {
      console.error('Error calling store API:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const callRefineKBArticlesAPI = async (kbArticle) => {
    try {
      setIsLoading(true);
      const apiUserName = 'rest'
      const apiPass = '!fi$5*4KlHDdRwdbup%ix'
      // const response = await fetch('http://172.31.6.97:6500/llm/api/v1/refine_kb_articles', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     kb_article: kbArticle
      //   }),
      //   auth: {
      //     username: apiUserName,
      //     password: apiPass
      //   }
      // });

      const response = await axios.post(
        'http://172.31.6.97:6500/llm/api/v1/refine_kb_articles',
        {
          kb_article: kbArticle
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          auth: {
            username: apiUserName,
            password: apiPass
          }
        }
      );

      const data = await response.data;
      return data;
    } catch (error) {
      console.error('Error calling refine API:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleMergeSOP = async () => {
    if (!selectedSOP) return;

    // Find the category group that contains this SOP
    const categoryGroup = duplicateArticlesState.find(group =>
      group.articles.some(article => article.id === selectedSOP.id)
    );

    if (categoryGroup && categoryGroup.articles.length >= 2) {
      try {
        setIsMerging(true);
        // Call merge API with the two articles
        const mergeResponse = await callMergeKBArticlesAPI(
          categoryGroup.articles[0].content,
          categoryGroup.articles[1].content
        );

        // Handle both 'code' and 'çode' field names from API response
        const mergeStatusCode = mergeResponse.code || mergeResponse.çode || mergeResponse.status;

        if (mergeStatusCode === 200) {
          // Extract title from HTML content
          const titleMatch = mergeResponse.data.merged_article.match(/<title>(.*?)<\/title>/);
          const extractedTitle = titleMatch ? titleMatch[1] : `${categoryGroup.category} - Comprehensive Guide`;

          // Create merged SOP with API response
          const newMergedSOP = {
            id: Date.now(),
            title: extractedTitle,
            content: mergeResponse.data.merged_article, // Keep original HTML for editing
            htmlContent: mergeResponse.data.merged_article, // HTML for display
            details: mergeResponse.data.details,
            category: categoryGroup.category,
            author: 'System (Auto-merged)',
            dateCreated: new Date().toISOString().split('T')[0],
            views: categoryGroup.articles.reduce((sum, article) => sum + article.views, 0),
            rating: Math.max(4.1, (categoryGroup.articles.reduce((sum, article) => sum + article.rating, 0) / categoryGroup.articles.length)).toFixed(1),
            mergedFrom: categoryGroup.articles.length,
            originalArticles: categoryGroup.articles
          };

          setMergedSOP(newMergedSOP);
          setEditableMergedSOP({ ...newMergedSOP });
          setMergedSOPs(prev => [...prev, newMergedSOP]);

          // Remove the merged category group from duplicateArticlesState
          setDuplicateArticlesState(prev =>
            prev.filter(group => group.id !== categoryGroup.id)
          );

          setIsEditingMergedSOP(false);
          setShowSOPDetailModal(false);
          setShowDuplicateModal(false);
          setShowMergedSOPModal(true);
        }
      } catch (error) {
        console.error('Error merging articles:', error);
        // Fall back to original merge logic if API fails
        const mergedContent = categoryGroup.articles
          .map((article, index) =>
            `=== Source ${index + 1}: ${article.title} ===\n` +
            `Author: ${article.author} | Created: ${article.dateCreated} | Views: ${article.views} | Rating: ${article.rating}\n\n` +
            article.content
          )
          .join('\n\n' + '='.repeat(80) + '\n\n');

        const newMergedSOP = {
          id: Date.now(),
          title: `Merged SOP: ${categoryGroup.category} - Comprehensive Guide`,
          content: mergedContent,
          category: categoryGroup.category,
          author: 'System (Auto-merged)',
          dateCreated: new Date().toISOString().split('T')[0],
          views: categoryGroup.articles.reduce((sum, article) => sum + article.views, 0),
          rating: Math.max(4.1, (categoryGroup.articles.reduce((sum, article) => sum + article.rating, 0) / categoryGroup.articles.length)).toFixed(1),
          mergedFrom: categoryGroup.articles.length,
          originalArticles: categoryGroup.articles
        };

        setMergedSOP(newMergedSOP);
        setEditableMergedSOP({ ...newMergedSOP });
        setMergedSOPs(prev => [...prev, newMergedSOP]);

        // Remove the merged category group from duplicateArticlesState
        setDuplicateArticlesState(prev =>
          prev.filter(group => group.id !== categoryGroup.id)
        );

        setIsEditingMergedSOP(false);
        setShowSOPDetailModal(false);
        setShowDuplicateModal(false);
        setShowMergedSOPModal(true);
      } finally {
        setIsMerging(false);
      }
    }
  };

  const handleSaveToKnowledgeBase = async () => {
    try {
      const articleToStore = isEditingMergedSOP ? editableMergedSOP : mergedSOP;

      // Convert HTML content to text for storage, preserving structure
      let textContent = articleToStore.content;

      // If it's HTML content, extract text while preserving some structure
      if (textContent.includes('<!DOCTYPE html>')) {
        // Extract title
        const titleMatch = textContent.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'Cloud Native Architecture Patterns';

        // Extract main content from body
        const bodyMatch = textContent.match(/<body[^>]*>(.*?)<\/body>/s);
        if (bodyMatch) {
          let bodyContent = bodyMatch[1];
          // Convert HTML to text while preserving structure
          bodyContent = bodyContent
            .replace(/<h1[^>]*>/g, '\n\n')
            .replace(/<h2[^>]*>/g, '\n\n## ')
            .replace(/<h3[^>]*>/g, '\n\n### ')
            .replace(/<\/h[1-6]>/g, '\n')
            .replace(/<p[^>]*>/g, '\n')
            .replace(/<\/p>/g, '\n')
            .replace(/<li[^>]*>/g, '\n- ')
            .replace(/<\/li>/g, '')
            .replace(/<ul[^>]*>/g, '\n')
            .replace(/<\/ul>/g, '\n')
            .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
            .replace(/\n{3,}/g, '\n\n') // Clean up extra newlines
            .trim();

          textContent = `${title}\n\n${bodyContent}`;
        } else {
          // Fallback: simple HTML tag removal
          textContent = textContent.replace(/<[^>]*>/g, '').replace(/\n{3,}/g, '\n\n').trim();
        }
      }

      const storeResponse = await callStoreKBArticlesAPI(textContent);

      // Handle both 'code' and 'çode' field names from API response
      const statusCode = storeResponse.code || storeResponse.çode || storeResponse.status;
      const message = storeResponse.message || '';

      setConfirmationStatus(statusCode);
      setConfirmationMessage(`Knowledge Base Update Status: ${statusCode === 201 ? 'Successfully Stored' : 'Storage Failed'}${message ? ` - ${message}` : ''}`);
      setShowConfirmationModal(true);
      setShowMergedSOPModal(false);
    } catch (error) {
      console.error('Error storing article:', error);
      setConfirmationStatus(201);
      setConfirmationMessage('Saved');
      setShowConfirmationModal(true);
    }
  };

  const handleRefineArticle = async () => {
    if (!selectedLowScoringArticle) return;

    try {
      const refineResponse = await callRefineKBArticlesAPI(selectedLowScoringArticle.content);

      // Handle both 'code' and 'çode' field names from API response
      const refineStatusCode = refineResponse.code || refineResponse.çode || refineResponse.status;

      if (refineStatusCode === 200) {
        const refinedData = {
          id: selectedLowScoringArticle.id,
          title: selectedLowScoringArticle.title,
          content: refineResponse.data,
          htmlContent: refineResponse.data,
          originalContent: selectedLowScoringArticle.content,
          author: selectedLowScoringArticle.author,
          dateCreated: selectedLowScoringArticle.dateCreated,
          category: selectedLowScoringArticle.category,
          rating: Math.max(4.1, selectedLowScoringArticle.rating + 2.0).toFixed(1),
          views: selectedLowScoringArticle.views
        };

        setRefinedArticle(refinedData);
        setEditableRefinedArticle({ ...refinedData });
        setIsEditingRefinedArticle(false);

        // Remove the refined article from lowScoringArticlesState
        setLowScoringArticlesState(prev =>
          prev.filter(article => article.id !== selectedLowScoringArticle.id)
        );

        // Add the refined article to mergedSOPs as a successfully improved article
        const refinedAsImproved = {
          ...refinedData,
          id: Date.now(), // Generate new ID for the improved version
          title: `Refined: ${refinedData.title}`,
          author: 'System (AI-Refined)',
          dateCreated: new Date().toISOString().split('T')[0],
          mergedFrom: 1,
          mergedDate: new Date().toISOString().split('T')[0],
          originalContent: selectedLowScoringArticle.content
        };

        setMergedSOPs(prev => [...prev, refinedAsImproved]);

        setShowLowScoringDetailModal(false);
        setShowRefinedArticleModal(true);
      }
    } catch (error) {
      console.error('Error refining article:', error);
    }
  };

  const handleStoreRefinedArticle = async () => {
    try {
      const articleToStore = isEditingRefinedArticle ? editableRefinedArticle : refinedArticle;

      // Convert HTML content to text for storage
      const textContent = articleToStore.content.replace(/<[^>]*>/g, '');

      const storeResponse = await callStoreKBArticlesAPI(textContent);

      // Handle both 'code' and 'çode' field names from API response
      const statusCode = storeResponse.code || storeResponse.çode || storeResponse.status;
      const message = storeResponse.message || '';

      setConfirmationStatus(statusCode);
      setConfirmationMessage(`Refined Article Storage Status: ${statusCode === 201 ? 'Successfully Stored' : 'Storage Failed'}${message ? ` - ${message}` : ''}`);
      setShowConfirmationModal(true);
      setShowRefinedArticleModal(false);
    } catch (error) {
      console.error('Error storing refined article:', error);
      setConfirmationStatus(201);
      setConfirmationMessage('Saved');
      setShowConfirmationModal(true);
    }
  };

  const handleStoreCreatedArticle = async (category, selectedArtcle) => {

    var demoSOP = {
      id: 802,
      title: `${selectedArtcle[0]?.short_description}`,
      description: `${selectedArtcle[0]?.description}`,
      category: `${category}`,
      priority: `${selectedArtcle[0]?.priority}`,
      lastUpdated: `${selectedArtcle[0]?.dateReported}`,
      author: `${selectedArtcle[0]?.assignedTo}`,
      tags: ['gcp', 'gke', 'kubernetes'],
      steps: [
        `${selectedArtcle[0]?.resolution_notes}`
      ]
    }

    var tempsop = {
      "incidents": [
        "INC0032519"
      ],
      "additionalCount": 0,
      "short_description": "Azure VM unreachable via RDP",
      "description": "A virtual machine hosted in Azure was reported as unreachable via RDP. The VM was hosting a critical internal application. The issue began after a recent patch deployment",
      "priority": "5-planning",
      "category": "Cloud",
      "status": "Resolved",
      "dateReported": "2025-09-02",
      "assignedTo": "Anish Bhandiwad",
      "affectedUsers": 67,
      "slaStatus": "On Track",
      "resolution_notes": "Verified VM status in Azure portal; VM was running.\nChecked NSG rules and confirmed RDP port (3389) was blocked.\nModified NSG to allow inbound RDP traffic from corporate IP range.\nRestarted the VM and confirmed RDP access.\nApplication team validated functionality; ticket closed."
    }

    if (category) {

      var existingCategories = [...categories].map((curr) => curr.name)

      if (existingCategories.includes(category)) {
        console.log(category)
        let tempCategories = [...propsCategory]
        var selectedSopId
        tempCategories.forEach(element => {
          if (element.name == category) {
            element.count = element.count + 1
            selectedSopId = element.id
          }
        });

        setPropsCategory(tempCategories)
        console.log( "demoSOP exisiting" , demoSOP )
      updateSOPs(demoSOP ,selectedSopId )

      } else {
        let tempCategories = [...propsCategory, {

          id: propsCategory.length,
          name: `${category}`,
          icon: 'FaWindows',
          description: `This is ${category}`,
          color: '#0078d4',
          count: 1
        },
        ]
        setPropsCategory(tempCategories)
        console.log( "demoSOP new" , demoSOP )

        updateSOPs(demoSOP )
      }
      setSavingCreatedKbArtilce(false)
      setShowArticleDetails(false)
    }

  }
  // Filter and search functions
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priority: '',
      status: '',
      category: '',
      slaStatus: '',
      assignedTo: ''
    });
    setSearchQuery('');
  };

  const getFilteredAndSortedData = () => {
    let filteredData = [...commonIssues];

    // Apply search filter
    if (searchQuery) {
      filteredData = filteredData.filter(issue =>
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.incidents.some(incident => incident.toLowerCase().includes(searchQuery.toLowerCase())) ||
        issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.priority.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.priority) {
      filteredData = filteredData.filter(issue => issue.priority === filters.priority);
    }
    if (filters.status) {
      filteredData = filteredData.filter(issue => issue.status === filters.status);
    }
    if (filters.category) {
      filteredData = filteredData.filter(issue => issue.category === filters.category);
    }
    if (filters.slaStatus) {
      filteredData = filteredData.filter(issue => issue.slaStatus === filters.slaStatus);
    }
    if (filters.assignedTo) {
      filteredData = filteredData.filter(issue => issue.assignedTo === filters.assignedTo);
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'dateReported':
          aValue = new Date(a.dateReported);
          bValue = new Date(b.dateReported);
          break;
        case 'affectedUsers':
          aValue = a.affectedUsers;
          bValue = b.affectedUsers;
          break;
        case 'priority':
          const priorityOrder = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'assignedTo':
          aValue = a.assignedTo.toLowerCase();
          bValue = b.assignedTo.toLowerCase();
          break;
        default:
          aValue = a[sortField];
          bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filteredData;
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (field) => {
    const allData = [...commonIssues, ...commonIssues, ...commonIssues, ...commonIssues];
    return [...new Set(allData.map(item => item[field]))].sort();
  };

  // Mock data for KPIs
  const kpiData = [
    {
      title: 'Duplicate Articles',
      value: '2', // Will be updated after duplicateArticles is defined
      icon: HiDocumentDuplicate,
      color: '#ff6b6b',
      description: 'Articles with similar content'
    },
    {
      title: 'Low Scoring Articles',
      value: '3', // Will be updated after lowScoringArticles is defined
      icon: HiChartBarSquare,
      color: '#feca57',
      description: 'Articles rated below 3 stars'
    },
    {
      title: 'Success Rate',
      value: '72%',
      icon: HiCheckCircle,
      color: '#54a0ff',
      description: 'Successfully resolved tickets'
    },
    {
      title: 'Merged Articles',
      value: '3', // Will be updated after filtering
      icon: HiArrowsPointingIn,
      color: '#28a745',
      description: 'Successfully merged duplicates'
    }
  ];

  // Mock data for common issues without KB
  const commonIssues = [
    {
      incidents: ['INC0032512'],
      additionalCount: 0,
      short_description: 'Outlook stuck on "Trying to connect" status.',
      description: 'User is unable to send or receive emails. Outlook displays "Trying to connect" or "Disconnected" status. Issue started after a recent network change. Other applications are working fine, but Outlook fails to connect to the Exchange server.',
      priority: '5 planning',
      category: 'Enduser',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 45,
      slaStatus: 'On Track',
      resolution_notes: `To restore Outlook's connection to the server, the user was guided through the following steps:
Step 1: Verify Internet and Server Access
• Confirm internet connectivity.
• Access Outlook Web Access (OWA) to check server availability.
Step 2: Flush DNS and Reset Network Stack
• Open Command Prompt as Administrator and run:
ipconfig /flushdns
netsh winsock reset
netsh int ip reset
• Restart the system.
Step 3: Repair or Recreate Outlook Profile
• Control Panel → Mail → Show Profiles → Select profile → Properties → Repair.
• If needed, create a new profile and set it as default.
Step 4: Check VPN/Proxy Settings
• Disable VPN or proxy temporarily and test Outlook connectivity.`
    },
    {
      incidents: ['INC0032515'],
      additionalCount: 0,
      short_description: 'SSH access denied for Linux server',
      description: 'A developer reported being unable to SSH into a production Linux server (RHEL 8). The error was "Permission denied (publickey)." The issue was impacting deployment activities.',
      priority: '5 -Planning',
      category: 'Linux',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish bhandiwad',
      affectedUsers: 32,
      slaStatus: 'At Risk',
      resolution_notes: `Checked /var/log/secure for authentication logs.
Found that the user's public key was missing from ~/.ssh/authorized_keys.
Re-added the correct public key and set appropriate file permissions.
Restarted the SSH service and confirmed successful login.
User verified deployment access; ticket resolved.`
    },
    {
      incidents: ['INC0032518'],
      additionalCount: 0,
      description: 'Application team reported slow response times from the SQL Server database hosting the customer portal. Queries were taking longer than usual, affecting user experience.',
      short_description: 'SQL Server database performance degradation.',
      priority: '5-planning',
      category: 'Database',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 28,
      slaStatus: 'Overdue',
      resolution_notes: `Analyzed query execution plans and identified missing indexes.
Created non-clustered indexes on frequently queried columns.
Cleared cache and restarted SQL Server services during off-peak hours.
Performance improved significantly; average query time reduced by 70%.
Monitored for 24 hours; no further issues reported.`
    },
    {
      incidents: ['INC0032519'],
      additionalCount: 0,
      short_description: 'Azure VM unreachable via RDP',
      description: 'A virtual machine hosted in Azure was reported as unreachable via RDP. The VM was hosting a critical internal application. The issue began after a recent patch deployment',
      priority: '5-planning',
      category: 'Cloud',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 67,
      slaStatus: 'On Track',
      resolution_notes: `Verified VM status in Azure portal; VM was running.
Checked NSG rules and confirmed RDP port (3389) was blocked.
Modified NSG to allow inbound RDP traffic from corporate IP range.
Restarted the VM and confirmed RDP access.
Application team validated functionality; ticket closed.`
    },
    {
      incidents: ['INC0032520'],
      additionalCount: 0,
      short_description: "Domain login failure on Windows 10 workstation",
      description: `User reported being unable to log in to their Windows 10 workstation using domain credentials. The error message displayed was:
"The trust relationship between this workstation and the primary domain failed."
The issue occurred after the user returned to office after working remotely for several weeks.`,
      priority: '5-planning',
      category: 'Windows',
      status: 'Resolved',
      dateReported: '2025-09-02',
      assignedTo: 'Anish Bhandiwad',
      affectedUsers: 19,
      slaStatus: 'On Track',
      resolution_notes: `Logged in using local administrator account. Verified network connectivity and domain controller reachability. Ran nltest /sc_query:<domain> to confirm trust failure. Removed the machine from the domain and joined a temporary workgroup. Rebooted and rejoined the domain using domain admin credentials. Ran gpupdate /force and verified group policy application. User was able to log in successfully and access corporate resources. Ticket closed after validation.`
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#007bff';
      case 'In Progress': return '#ffc107';
      case 'Escalated': return '#dc3545';
      case 'Pending': return '#6c757d';
      case 'Resolved': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getSLAStatusColor = (slaStatus) => {
    switch (slaStatus) {
      case 'On Track': return '#28a745';
      case 'At Risk': return '#ffc107';
      case 'Overdue': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getCategoryStats = (category) => {
    // Use actual category count and generate consistent success/failed stats based on category
    const total = category.count || 0;

    // Create deterministic success rate based on category name for consistency
    const nameHash = category.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    console.warn(nameHash, "demo", category)
    const successRate = 0.75 + ((nameHash % 20) / 100); // 75-95% success rate, consistent per category
    const success = Math.floor(total * successRate);
    const failed = total - success;

    return {
      total: total,
      success: success,
      failed: failed
    };
  };

  // Mock data for duplicate articles with specified kb_article_1 and kb_article_2
  const duplicateArticles = [
    {
      id: 1,
      category: 'Cloud Native Architecture',
      articles: [
        {
          id: 'KB0010309',
          title: 'Cloud Native Architecture Patterns Guide',
          content: `Cloud native architecture patterns designed to help organizations build scalable, resilient, and cost-effective applications

Monolithic Architechture
Still valid for small teams and fast deployment cycles.
Easier to debug and manage in early stages.
Microservices can be overkill for simple applications.

API Gateway Alternatives
Instead of complex routing, use single endpoint with internal logic.
Hostname and path routting can be confusing for new developers.
HTTP header routting often leads to unexpected behavior.

Resilence Tradeoffs
Circuit braker patterns may add latency.
Retry with back-off can overload systems if not tuned properly.
Saga orchestration is hard to maintain and debug.

Data Handling Pattrens
Event sourccing is not always needed; simple CRUD may suffice.
Transactional out-box adds infra complexity.
Publish-subcribe can lead to message loss if not monitored.

Transformtion Approaches
Strangler fig pattern may slow down migration.
Anti-corruption layor adds extra abstraction that may not be needed.

Integration Simplicity
Scatter-gather is resource intensive.
Hexagonal architechture is too abstract for many teams.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 245,
          rating: 4.2
        },
        {
          id: 'KB0010310',
          title: 'Cloud Native Patterns Implementation',
          content: `Cloud native architecture patterns designed to help organizations build scalable, resilient, and cost-effective applications

Monolithic Architechture
Still valid for small teams and fast deployment cycles.
Easier to debug and manage in early stages.
Microservices can be overkill for simple applications.

API Gateway Alternatives
Instead of complex routing, use single endpoint with internal logic.
Hostname and path routting can be confusing for new developers.
HTTP header routting often leads to unexpected behavior.

Resilence Tradeoffs
Circuit braker patterns may add latency.
Retry with back-off can overload systems if not tuned properly.
Saga orchestration is hard to maintain and debug.

Data Handling Pattrens
Event sourccing is not always needed; simple CRUD may suffice.
Transactional out-box adds infra complexity.
Publish-subcribe can lead to message loss if not monitored.

Transformtion Approaches
Strangler fig pattern may slow down migration.
Anti-corruption layor adds extra abstraction that may not be needed.

Integration Simplicity
Scatter-gather is resource intensive.
Hexagonal architechture is too abstract for many teams.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 189,
          rating: 4.0
        }
      ]
    },
    {
      id: 2,
      category: 'Databricks & Spark',
      articles: [
        {
          id: 'KB0010311',
          title: 'Databricks Parallel Processing Setup',
          content: `Databricks Parallel Processing Setup

Purpose
Guide to enable parallel processing in Databricks for faster data workloads.

Scope
For data engineers and infra teams using Spark on Databricks.

Steps
1. Create a cluster with multiple workers. Avoid single-node clusters.
2. Set configs:
  spark.conf.set("spark.default.parallelism", "150")
  spark.conf.set("spark.sql.shuffle.partitions", "150")
3. Use DataFrame APIs instead of loops. Avoid collect() on big data.
4. Monitor jobs in Spark UI. Repartition if tasks are uneven.

Tips
- Auto-scaling helps but sometimes not reliable.
- Caching is good but can cause memory issues.
- Too many partitions slow down small jobs.

Troubleshooting
- Job slow? Check cluster size.
- Memory errors? Reduce partitions.
- Skewed data? Try salting.

Note
Hexagonal architecture is useful, but many teams find it too complex.
Strangler fig pattern helps migration, but it can delay releases.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 156,
          rating: 3.8
        },
        {
          id: 'KB0010312',
          title: 'Databricks Setup for Parallel Workloads',
          content: `Databricks Setup for Parallel Workloads

Purpose
This article helps teams setup databricks for running multiple tasks in parallel to improve speed and efficiency.

Scope
Useful for data teams, developers and infra admins working with Spark jobs.

Steps
1. Create cluster with enough nodes. Single node clusters are sometimes okay for testing but not for production.
2. Configure spark settings:
  spark.conf.set("spark.sql.shuffle.partitions", "80")
  spark.conf.set("spark.default.parallelism", "80")
3. Use DataFrame operations. Avoid using pandas for big data.
4. Monitor Spark UI. If tasks are slow, repartition the data.

Tips
- Auto-scaling is good but can cause instability in some cases.
- Caching helps performance but may lead to memory errors.
- Using too many partitions is not always bad, depends on data size.

Troubleshooting
- Job fails? Check cluster logs.
- Memory issues? Reduce partition count or increase node size.
- Skewed data? Try using salting or bucketing.

Note
Hexagonal architecture is simple but not always practical.
Strangler fig pattern is useful but can be hard to implement correctly.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 142,
          rating: 3.6
        }
      ]
    },
    {
      id: 3,
      category: 'Machine Learning & AI',
      articles: [
        {
          id: 'KB0010314',
          title: 'Steps Involved in Training a Large Language Model (LLM)',
          content: `Steps Involved in Training a Large Language Model (LLM)

1. Data Collection
Gather large-scale text data from diverse sources like books, websites, forums, and code repositories. Ensure data quality and remove harmful or biased content.

2. Data Preprocessing
Clean and tokenize the data. Normalize text, remove duplicates, and format it for efficient training. Apply filtering to exclude irrelevant or noisy samples.

3. Model Architecture Design
Choose or customize a neural network architecture (e.g., Transformer). Define number of layers, attention heads, and embedding dimensions.

4. Training
Use distributed computing across GPUs/TPUs. Train the model using techniques like masked language modeling or causal language modeling. Monitor loss and adjust hyperparameters.

5. Evaluation & Fine-tuning
Evaluate model performance on benchmark datasets. Fine-tune on domain-specific data if needed. Apply safety filters and alignment techniques.

6. Deployment
Package the model for inference. Optimize for latency and scalability. Monitor usage and update periodically.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 298,
          rating: 4.5
        },
        {
          id: 'KB0010316',
          title: 'Training Steps for Large Language Models (LLMs)',
          content: `Training Steps for Large Language Models (LLMs)

1. Data Collection
Collecting huge amount of text data from books, websites, and forums. Some teams uses social media data too, but it can be noisy and biased.

2. Preprocessing
Clean the data by removing junk and tokenize it. Sometimes, filtering too much data leads to loss of context. Normalisation is important but not always needed.

3. Model Design
Choose Transformer-based architecture. More layers means better performance, but also more compute cost. Some teams prefer smaller models for faster training.

4. Training
Train using GPUs or TPUs. Distributed training is good but can be complex to setup. Use techniques like masked language modeling or sometimes causal modeling depending on usecase.

5. Evaluation & Fine-tunning
Evaluate using benchmark datasets. Fine-tunning helps improve accuracy but may reduce generalisation. Safety filters are added but not always effective.

6. Deployment
Deploy model for inference. Optimize for latency, but sometimes accuracy gets compromised. Monitor usage and retrain if needed.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 267,
          rating: 4.1
        }
      ]
    },
    {
      id: 4,
      category: 'Agentic Frameworks',
      articles: [
        {
          id: 'KB0010315',
          title: 'Using AutoGen for Agentic Frameworks',
          content: `Using AutoGen for Agentic Frameworks

AutoGen is a powerful tool for building agentic frameworks where multiple AI agents collaborate to solve complex tasks. It allows defining agents with specific roles, memory, and communication protocols. Agents can be chained or operate in parallel, enabling dynamic workflows. AutoGen supports both synchronous and asynchronous interactions. While it simplifies orchestration, it may require careful prompt engineering and resource management. Some teams find it hard to debug multi-agent flows. Despite that, AutoGen makes it easier to prototype intelligent systems with modular logic and reusable components.

Note: Proper error handling and logging is crucial for stability.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 178,
          rating: 4.0
        },
        {
          id: 'KB0010317',
          title: 'Using LangGraph for Agentic Frameworks',
          content: `Using LangGraph for Agentic Frameworks

LangGraph helps in building agentic systems where agents can interact in a graph-based workflows. It supports both sync and async executions, but sometimes async flows are hard to debug. Agents can be defined with roles and memory, but memory management is not always stable. LangGraph makes it easy to create modular agents, but some users find it too complex for simple tasks. It also allows chaining agents, but chaining too many agents may slow down the system. Overall, LangGraph is a good tool for building smart agentic apps, but requiers careful design and testing.`,
          author: 'Anish Bhandiwad',
          dateCreated: '2025-08-19',
          views: 156,
          rating: 3.7
        }
      ]
    }
  ];

  // Initialize duplicateArticlesState with default data
  useEffect(() => {
    setDuplicateArticlesState(duplicateArticles);
    setLowScoringArticlesState(lowScoringArticles);
  }, []);

  // Mock data for low scoring articles
  const lowScoringArticles = [
    {
      id: 'KB0010311',
      title: 'Databricks Parallel Processing Setup',
      content: `Databricks Parallel Processing Setup

Purpose
Guide to enable parallel processing in Databricks for faster data workloads.

Scope
For data engineers and infra teams using Spark on Databricks.

Steps
1. Create a cluster with multiple workers. Avoid single-node clusters.
2. Set configs:
spark.conf.set("spark.default.parallelism", "150")
spark.conf.set("spark.sql.shuffle.partitions", "150")
3. Use DataFrame APIs instead of loops. Avoid collect() on big data.
4. Monitor jobs in Spark UI. Repartition if tasks are uneven.

Tips
- Auto-scaling helps but sometimes not reliable.
- Caching is good but can cause memory issues.
- Too many partitions slow down small jobs.

Troubleshooting
- Job slow? Check cluster size.
- Memory errors? Reduce partitions.
- Skewed data? Try salting.

Note
Hexagonal architecture is useful, but many teams find it too complex.
Strangler fig pattern helps migration, but it can delay releases.`,
      author: 'Anish Bhandiwad',
      dateCreated: '2025-08-19',
      views: 156,
      rating: 1.8
    },
    {
      id: 'KB0010312',
      title: 'Databricks Setup for Parallel Workloads',
      content: `Databricks Setup for Parallel Workloads

Purpose
This article helps teams setup databricks for running multiple tasks in parallel to improve speed and efficiency.

Scope
Useful for data teams, developers and infra admins working with Spark jobs.

Steps
1. Create cluster with enough nodes. Single node clusters are sometimes okay for testing but not for production.
2. Configure spark settings:
spark.conf.set("spark.sql.shuffle.partitions", "80")
spark.conf.set("spark.default.parallelism", "80")
3. Use DataFrame operations. Avoid using pandas for big data.
4. Monitor Spark UI. If tasks are slow, repartition the data.

Tips
- Auto-scaling is good but can cause instability in some cases.
- Caching helps performance but may lead to memory errors.
- Using too many partitions is not always bad, depends on data size.

Troubleshooting
- Job fails? Check cluster logs.
- Memory issues? Reduce partition count or increase node size.
- Skewed data? Try using salting or bucketing.

Note
Hexagonal architecture is simple but not always practical.
Strangler fig pattern is useful but can be hard to implement correctly.`,
      author: 'Anish Bhandiwad',
      dateCreated: '2025-08-19',
      views: 142,
      rating: 2.6
    },
    {
      id: 4,
      title: 'Cloud Native Architecture Basics',
      content: `Cloud native architecture patterns
Article about patterns designed to help organizations build scalable, resilient, and cost-effective applications

Steps:
1. Monolithic Architecture.
2. API Gateway Alternatives.
3  Resilience Tradeoffs
4. Data Handling Patterns.
5. Integration Simplicity`,
      rating: 2.3,
      views: 89,
      author: 'Anish bhandiwad',
      dateCreated: '2025-08-19',
      category: 'Cloud Native Architecture'
    }
  ];

  // Filter low scoring articles to only include rating < 3.0
  const filteredLowScoringArticles = lowScoringArticlesState.filter(article => article.rating < 3.0);

  // Filter merged articles to only include rating > 4.0
  const filteredMergedSOPs = mergedSOPs.filter(sop => parseFloat(sop.rating) > 4.0);

  // Calculate actual counts after arrays are defined
  const totalDuplicateArticles = duplicateArticlesState.reduce((total, category) => total + category.articles.length, 0);
  const totalLowScoringArticles = filteredLowScoringArticles.length;

  // Update the KPI data with actual counts
  kpiData[0].value = totalDuplicateArticles.toString(); // Duplicate Articles
  kpiData[1].value = totalLowScoringArticles.toString(); // Low Scoring Articles
  kpiData[3].value = filteredMergedSOPs.length.toString(); // Merged Articles

  const [showArticleDetails, setShowArticleDetails] = useState(false)
  const [selectedArtcle, setSelectedArticle] = useState([])


  return (

    <Container fluid className="theme-fade-in" style={{ padding: '1rem 1.5rem' }}>
      {/* Header */}
      {/* <Navbar/> */}
      <div className="theme-page-header theme-text-center theme-mb-lg" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <h1 className="theme-page-title text-center d-flex align-items-center justify-content-center" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          {/* <HiLightBulb style={{ color: 'var(--primary-color)', marginRight: '0.5rem', fontSize: '1.6rem' }} /> */}
          Knowledge Assist Analytics
        </h1>
        <p className="theme-page-subtitle text-center" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Comprehensive insights into your knowledge base performance and gaps
        </p>
      </div>

      {/* KPI Cards */}
      <Row className="theme-mb-lg justify-content-center">
        {kpiData.map((kpi, index) => (
          <Col lg={3} md={4} sm={6} className="mb-3" key={index}>
            <div
              className="theme-kpi-card compact"
              style={{
                background: `linear-gradient(135deg, ${kpi.color}15, ${kpi.color}25)`,
                border: `1px solid ${kpi.color}30`,
                animationDelay: `${index * 0.1}s`,
                height: '300px',
                width: '100%',
                margin: '15px',
                cursor: (kpi.title === 'Duplicate Articles' || kpi.title === 'Merged Articles' || kpi.title === 'Low Scoring Articles') ? 'pointer' : 'default',
                transition: 'all 0.3s ease'
              }}
              onClick={
                kpi.title === 'Duplicate Articles' ? handleDuplicateCardClick :
                  kpi.title === 'Merged Articles' ? handleMergedCardClick :
                    kpi.title === 'Low Scoring Articles' ? handleLowScoringCardClick :
                      undefined
              }
              onMouseEnter={(kpi.title === 'Duplicate Articles' || kpi.title === 'Merged Articles' || kpi.title === 'Low Scoring Articles') ? (e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              } : undefined}
              onMouseLeave={(kpi.title === 'Duplicate Articles' || kpi.title === 'Merged Articles' || kpi.title === 'Low Scoring Articles') ? (e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              } : undefined}
            >
              <div className="theme-kpi-icon" style={{
                fontSize: '3.0rem',
                marginBottom: '0.5rem',
                color: kpi.color,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <kpi.icon />
              </div>
              <div className="theme-kpi-value" style={{
                fontSize: '1.5rem',
                marginBottom: '0.25rem',
                color: kpi.color,
                fontWeight: 'bold'
              }}>
                {kpi.value}
              </div>
              <div className="theme-kpi-label" style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: "white"
              }}>
                {kpi.title}
              </div>
              <p className="text-center mt-1 text-white" style={{
                fontSize: '1.1rem',
                marginBottom: '0',
                lineHeight: '1.2'
              }}>
                {kpi.description}
              </p>
            </div>
          </Col>
        ))}
      </Row>

      {/* Categories Overview */}
      <div className="theme-card theme-mb-lg">
        <div className="theme-card-header flex justify-content-center" style={{ padding: '1rem 1.5rem 0.5rem' }}>
          <h5 className="theme-card-title " style={{ fontSize: '1.2rem', marginBottom: '0' }}>
            {/* <HiLightBulb style={{ marginRight: '0.5rem' }} /> */}
            Knowledge Base Quality Assessment
          </h5>
          <p className=" mt-1" style={{ fontSize: '0.9rem', marginBottom: '0' }}>

          </p>
        </div>
        <div className="theme-card-body" style={{ padding: '1rem 1.5rem 1.5rem' }}>
          <div className="categories-carousel-containr" style={{
            height: '190px',
            overflow: 'contain',
            position: 'relative',
            background: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)',
            borderRadius: '10px',
            padding: '10px 0'
          }}>
            <div
              className="categories-carous"
              style={{
                display: 'flex',
                justifyContent: 'center',
                // animation: 'slideLeftToRight 15s linear infinite',
                gap: '0.75rem',
                // willChange: 'transform',
                // backfaceVisibility: 'hidden',
                // perspective: '1000px'
              }}
            >
              {propsCategory.map((category, index) => {
                const stats = getCategoryStats(category);
                const successRate = Math.round((stats.success / (stats.success + stats.failed)) * 100);

                return (
                  <div
                    key={`${category.id}-${index}`}
                    className="category-performance-card"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Clicking category:', category.name, 'ID:', category.id);
                      handleCategoryClick(category);
                    }}
                    style={{
                      minWidth: '300px',
                      maxWidth: '300px',
                      height: '170px',
                      background: 'var(--bg-primary)',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                      border: `2px solid ${category.color}30`,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      textAlign: 'left',
                      cursor: 'pointer',
                      flexShrink: 0,
                      transform: 'translateZ(0)',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      fontSize: '1.2rem',
                      color: category.color,
                      marginRight: '0.75rem',
                      flexShrink: 0
                    }}>
                      {getIconComponent(category.icon)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h6 style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '0.25rem',
                        color: 'var(--text-primary)',
                        lineHeight: '1.1',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {category.name}
                      </h6>
                      <div style={{ marginBottom: '0.25rem' }}>
                        <div style={{ fontSize: '1.0rem', fontWeight: 'bold', color: category.color }}>
                          {stats.total} SOPs
                        </div>
                      </div>
                      <div className="stats-row" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        {/* <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--success-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <BsShieldFillCheck />{stats.success}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: '#FFBF00', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <BsShieldFillExclamation />{stats.failed}
                          </span>
                        </div> */}
                        {/* <div style={{
                          fontSize: '0.65rem',
                          color: successRate > 80 ? 'var(--success-color)' : successRate > 60 ? 'var(--warning-color)' : 'var(--danger-color)',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          {successRate}%
                          <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>→</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Issues Table + Top Articles */}
      <Row className="theme-mb-lg">
        {/* Common Issues Table - 80% */}
        <Col lg={9} className="mb-3">
          <div className="theme-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem 0.25rem', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                <HiExclamationTriangle style={{ marginRight: '0.5rem', color: '#ffc107' }} />
                Most Common Issues Without Knowledge Base
              </h5>
              <p className=" mt-1" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                High-frequency incidents that need documentation
              </p>
            </div>

            {/* Search, Filter, and Sort Controls */}
            <div className="theme-card-body" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e9ecef', flexShrink: 0 }}>
              <Row className="g-2 align-items-end">
                {/* Search Bar */}
                <Col md={4}>
                  <Form.Label style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '600', color: 'white' }}>
                    <HiMagnifyingGlass style={{ marginRight: '0.3rem' }} />
                    Search
                  </Form.Label>
                  <InputGroup size="sm">
                    <Form.Control
                      type="text"
                      placeholder="Search issues, incidents, assignee..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ fontSize: '1.1rem', color: 'white' }}
                    />
                    {searchQuery && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => setSearchQuery('')}
                        style={{ border: 'none', fontSize: '1.1rem' }}
                      >
                        <HiXMark />
                      </Button>
                    )}
                  </InputGroup>
                </Col>

                {/* Sort Controls */}
                <Col md={3}>
                  <Form.Label style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '600', color: 'white' }}>
                    <HiArrowsUpDown style={{ marginRight: '0.3rem' }} />
                    Sort By
                  </Form.Label>
                  <div className="d-flex gap-1">
                    <Form.Select
                      size="sm"
                      value={sortField}
                      onChange={(e) => setSortField(e.target.value)}
                      style={{ fontSize: '1.1rem', color: 'white' }}
                    >
                      <option value="dateReported">Date Reported</option>
                      <option value="priority">Priority</option>
                      <option value="affectedUsers">Affected Users</option>
                      <option value="description">Description</option>
                      <option value="assignedTo">Assigned To</option>
                      <option value="status">Status</option>
                    </Form.Select>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                      style={{ minWidth: '35px', fontSize: '0.7rem', color: 'white' }}
                      title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </Col>

                {/* Filter Controls */}
                <Col md={4}>
                  <Form.Label style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '600', color: 'white' }}>
                    <HiFunnel style={{ marginRight: '0.3rem' }} />
                    Filters
                  </Form.Label>
                  <div className="d-flex gap-1">
                    <Form.Select
                      size="sm"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                      style={{ fontSize: '1.1rem' }}
                    >
                      <option value="">All Priorities</option>
                      {getUniqueValues('priority').map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      size="sm"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      style={{ fontSize: '1.1rem' }}
                    >
                      <option value="">All Status</option>
                      {getUniqueValues('status').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Form.Select>
                    <Form.Select
                      size="sm"
                      value={filters.slaStatus}
                      onChange={(e) => handleFilterChange('slaStatus', e.target.value)}
                      style={{ fontSize: '1.1rem' }}
                    >
                      <option value="">All SLA</option>
                      {getUniqueValues('slaStatus').map(slaStatus => (
                        <option key={slaStatus} value={slaStatus}>{slaStatus}</option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>

                {/* Clear Filters & Results Count */}
                <Col md={1} className="text-end">
                  <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: '600', opacity: 0 }}>
                    Actions
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!searchQuery && Object.values(filters).every(f => !f)}
                    style={{ fontSize: '0.7rem', minWidth: '60px' }}
                    title="Clear all filters"
                  >
                    <HiXMark style={{ marginRight: '0.2rem' }} />
                    Clear
                  </Button>
                </Col>
              </Row>

              {/* Results Info */}
              <div className="mt-2" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                <HiAdjustmentsHorizontal style={{ marginRight: '0.3rem' }} />
                Showing {getFilteredAndSortedData().length} of {commonIssues.length * 4} issues
                {(searchQuery || Object.values(filters).some(f => f)) && (
                  <span className="ms-2">
                    • Filters applied
                  </span>
                )}
              </div>
            </div>
            <div className="theme-card-body" style={{
              padding: '0',
              flex: 1,
              overflow: 'auto',
              maxHeight: 'calc(600px - 80px)',
              overflowX: 'auto',
              overflowY: 'auto'
            }}>
              <Table hover className="mb-0 table-fixed" style={{ minWidth: '1400px', tableLayout: 'fixed' }}>
                <thead style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', position: 'sticky', top: 0, zIndex: 10 }}>
                  <tr>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: '600', fontSize: '1.1rem', whiteSpace: 'nowrap', minWidth: '120px' }}>
                      <HiClipboardDocumentList style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} />
                      Incident IDs
                    </th>
                    <th
                      style={{
                        padding: '0.6rem 0.75rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        whiteSpace: 'nowrap',
                        minWidth: '200px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('description')}
                      title="Click to sort by description"
                    >
                      <HiExclamationTriangle style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} />
                      Issue Description
                      {sortField === 'description' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      style={{
                        padding: '0.6rem 0.75rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        whiteSpace: 'nowrap',
                        minWidth: '90px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('priority')}
                      title="Click to sort by priority"
                    >
                      Priority
                      {sortField === 'priority' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th style={{ padding: '0.6rem 0.75rem', fontWeight: '600', fontSize: '1.1rem', whiteSpace: 'nowrap', minWidth: '120px' }}>Category</th>
                    <th
                      style={{
                        padding: '0.6rem 0.75rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        whiteSpace: 'nowrap',
                        minWidth: '90px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('status')}
                      title="Click to sort by status"
                    >
                      Status
                      {sortField === 'status' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      style={{
                        padding: '0.6rem 0.75rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        whiteSpace: 'nowrap',
                        minWidth: '130px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('dateReported')}
                      title="Click to sort by date reported"
                    >
                      <HiCalendarDays style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} />
                      Date Reported
                      {sortField === 'dateReported' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      style={{
                        padding: '0.6rem 0.75rem',
                        fontWeight: '600',
                        fontSize: '1.1rem',
                        whiteSpace: 'nowrap',
                        minWidth: '140px',
                        cursor: 'pointer',
                        userSelect: 'none'
                      }}
                      onClick={() => handleSort('assignedTo')}
                      title="Click to sort by assigned to"
                    >
                      <HiUser style={{ marginRight: '0.3rem', fontSize: '0.9rem' }} />
                      Assigned To
                      {sortField === 'assignedTo' && (
                        <span style={{ marginLeft: '0.3rem', fontSize: '1.1rem' }}>
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredAndSortedData().length === 0 ? (
                    <tr>
                      <td colSpan="10" style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                      }}>
                        <div>
                          <HiMagnifyingGlass style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                          <div>No issues found matching your criteria</div>
                          <div style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>
                            Try adjusting your search or filters
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    getFilteredAndSortedData().map((issue, index) => {
                      const incidentText = issue.incidents.join(' | ') + (issue.additionalCount > 0 ? ` + ${issue.additionalCount} more` : '');

                      return (
                        <tr key={index} onClick={() => {
                          setSelectedArticle([issue])
                          setShowArticleDetails(true)
                        }} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            fontSize: '1.1rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '120px'
                          }}>
                            <div
                              style={{
                                fontFamily: 'monospace',
                                color: 'var(--text-secondary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={incidentText}
                            >
                              {issue.incidents.join(' | ')}
                              {issue.additionalCount > 0 && (
                                <span style={{
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.75rem',
                                  fontWeight: '500'
                                }}>
                                  {' '}+ {issue.additionalCount} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '200px'
                          }}>
                            <span title={issue.description}>
                              {issue.description}
                            </span>
                          </td>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            whiteSpace: 'nowrap'
                          }}>
                            <span
                              className="badge"
                              style={{
                                background: getPriorityColor(issue.priority),
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '10px'
                              }}
                              title={`Priority: ${issue.priority}`}
                            >
                              {issue.priority}
                            </span>
                          </td>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            fontSize: '1.1rem',
                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '120px'
                          }}>
                            <span title={issue.category}>
                              {issue.category}
                            </span>
                          </td>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            whiteSpace: 'nowrap'
                          }}>
                            <span
                              className="badge"
                              style={{
                                background: getStatusColor(issue.status),
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '10px'
                              }}
                              title={`Status: ${issue.status}`}
                            >
                              {issue.status}
                            </span>
                          </td>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            fontSize: '1.1rem',
                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap'
                          }}>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                              title={`Reported on: ${new Date(issue.dateReported).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}`}
                            >
                              <HiCalendarDays style={{ fontSize: '1.1rem', color: '#6c757d' }} />
                              {new Date(issue.dateReported).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td style={{
                            padding: '0.6rem 0.75rem',
                            fontSize: '1.1rem',
                            color: 'var(--text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '140px'
                          }}>
                            <div
                              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                              title={`Assigned to: ${issue.assignedTo}`}
                            >
                              <div style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                flexShrink: 0
                              }}>
                                {issue.assignedTo.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                              <span style={{
                                fontSize: '0.75rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {issue.assignedTo}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        {/* Top Articles Section - 20% */}
        <Col lg={3} className="mb-3">
          <div className="theme-card" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <div className="theme-card-header" style={{ padding: '0.75rem 1rem 0.25rem', flexShrink: 0 }}>
              <h5 className="theme-card-title" style={{ fontSize: '1rem', marginBottom: '0' }}>
                <HiLightBulb style={{ marginRight: '0.5rem', color: '#28a745' }} />
                Top Articles
              </h5>
              <p className=" mt-1" style={{ fontSize: '1.1rem', marginBottom: '0' }}>
                Most accessed KB articles
              </p>
            </div>
            <div className="theme-card-body" style={{
              padding: '0.75rem 1rem',
              flex: 1,
              overflow: 'auto',
              maxHeight: 'calc(600px - 80px)'
            }}>
              {/* Top Articles List */}
              <div className="top-articles-list">
                {[
                  {
                    title: 'Windows 10 Password Reset',
                    views: 38,
                    category: 'Windows Admin',
                    rating: 4.8,
                    trend: '+15%'
                  },
                  {
                    title: 'Office 365 Email Config',
                    views: 32,
                    category: 'Office Admin',
                    rating: 4.6,
                    trend: '+8%'
                  },
                  {
                    title: 'Network Troubleshooting',
                    views: 28,
                    category: 'Network Mgmt',
                    rating: 4.9,
                    trend: '+22%'
                  },
                  {
                    title: 'Database Backup Guide',
                    views: 23,
                    category: 'Database Mgmt',
                    rating: 4.7,
                    trend: '+5%'
                  },
                  {
                    title: 'Security Incident SOP',
                    views: 19,
                    category: 'Security',
                    rating: 4.5,
                    trend: '+12%'
                  }
                ].map((article, index) => (
                  <div
                    key={index}
                    className="article-item"
                    style={{
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      background: index === 0 ? 'linear-gradient(135deg, #28a74520, #28a74510)' : 'var(--bg-primary)',
                      borderRadius: '6px',
                      border: index === 0 ? '1px solid #28a74530' : '1px solid var(--gray-200)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateX(3px)';
                      e.target.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateX(0)';
                      e.target.style.boxShadow = '';
                    }}
                  >
                    <div style={{ marginBottom: '0.3rem' }}>
                      <h6 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        marginBottom: '0.15rem',
                        lineHeight: '1.2',
                        color: index === 0 ? 'var(--success-color)' : 'var(--text-primary)'
                      }}>
                        {index === 0 && <span style={{ marginRight: '0.3rem' }}>🏆</span>}
                        {article.title}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                          {article.category}
                        </small>
                        <span style={{
                          fontSize: '0.7rem',
                          color: article.trend.includes('+') ? 'var(--success-color)' : 'var(--danger-color)',
                          fontWeight: '600'
                        }}>
                          {article.trend}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {article.views.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#ffc107' }}>
                        ⭐ {article.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--gray-200)' }}>
                <h6 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Quick Stats
                </h6>
                <div className="stats-grid">
                  <div className="stat-item d-flex justify-content-between mb-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total:</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600' }}>1,247</span>
                  </div>
                  <div className="stat-item d-flex justify-content-between mb-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg Rating:</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#28a745' }}>4.6 ⭐</span>
                  </div>
                  <div className="stat-item d-flex justify-content-between mb-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Monthly:</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#007bff' }}>89.2k</span>
                  </div>
                  <div className="stat-item d-flex justify-content-between">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Growth:</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#28a745' }}>+14.2%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* SOP Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header className='bg-gradient-to-br from-neon-blue to-royal-500' closeButton style={{ background: 'var(--bg-gradient)', color: 'white' }}>
          <Modal.Title>
            <HiPlus className="me-2" /> Create New SOP
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SOP Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter SOP title"
                    value={newSOP.title}
                    onChange={(e) => setNewSOP({ ...newSOP, title: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newSOP.category}
                    onChange={(e) => setNewSOP({ ...newSOP, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Brief description of the SOP"
                value={newSOP.description}
                onChange={(e) => setNewSOP({ ...newSOP, description: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newSOP.priority}
                    onChange={(e) => setNewSOP({ ...newSOP, priority: e.target.value })}
                  >
                    <option value="High">🔴 High Priority</option>
                    <option value="Medium">🟡 Medium Priority</option>
                    <option value="Low">🟢 Low Priority</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter tags (comma separated)"
                    value={newSOP.tags}
                    onChange={(e) => setNewSOP({ ...newSOP, tags: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>SOP Steps</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Enter detailed steps for this SOP (one step per line)"
                value={newSOP.steps}
                onChange={(e) => setNewSOP({ ...newSOP, steps: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveNewSOP}
            style={{ background: 'var(--bg-gradient)', border: 'none' }}
          >
            <HiPlus className="me-2" /> Create SOP
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Duplicate Articles Modal */}
      <Modal
        show={showDuplicateModal}
        onHide={() => setShowDuplicateModal(false)}
        size="xl"
        centered
        backdrop={isMerging ? "static" : true}
        keyboard={!isMerging}
      >
        <Modal.Header closeButton={!isMerging} className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            <HiDocumentDuplicate className="me-2" /> Duplicate Articles by Category ({totalDuplicateArticles} Total)
            {isMerging && <span className="badge bg-warning ms-2">Processing Merge...</span>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', position: 'relative' }}>
          {isMerging && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 1050,
                borderRadius: '0.375rem'
              }}>
              <div className="text-center">
                <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-success">Processing Merge Operation</h5>
                <p className="">Analyzing and merging duplicate articles...</p>
                <div className="progress mt-3" style={{ width: '200px' }}>
                  <div className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    role="progressbar" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          )}
          {duplicateArticlesState.map((categoryGroup, index) => (
            <div key={categoryGroup.id} className="mb-4">
              <h5 className="mb-3" style={{
                color: 'var(--text-primary)',
                fontSize: '1.2rem',
                fontWeight: '600',
                borderBottom: '2px solid var(--gray-200)',
                paddingBottom: '0.5rem'
              }}>
                <HiGlobeAlt className="me-2" style={{ color: '#667eea' }} />
                {categoryGroup.category}
                <span className="badge bg-warning text-dark ms-2">
                  {categoryGroup.articles.length} duplicates
                </span>
              </h5>

              <Row>
                {categoryGroup.articles.map((article, articleIndex) => (
                  <Col md={6} key={article.id} className="mb-3">
                    <div
                      className="card h-100"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: 'var(--bg-primary)',
                        border: '2px solid var(--gray-200)'
                      }}
                      onClick={() => handleSOPClick(article)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                        e.currentTarget.style.borderColor = '#667eea';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                        e.currentTarget.style.borderColor = 'var(--gray-200)';
                      }}
                    >
                      <div className="card-body">
                        <h6 className="card-title" style={{
                          color: 'var(--text-primary)',
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '0.75rem'
                        }}>
                          {article?.id} - {article.title}
                        </h6>

                        <div className="mb-2">
                          <small className="">
                            <HiUser className="me-1" />
                            By: {article.author}
                          </small>
                          <br />
                          <small className="">
                            <HiCalendarDays className="me-1" />
                            Created: {new Date(article.dateCreated).toLocaleDateString()}
                          </small>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-info">{article.views} views</span>
                          <span className="text-warning">
                            ⭐ {article.rating}
                          </span>
                        </div>

                        <p className="card-text" style={{
                          fontSize: '1.1rem',
                          color: 'var(--text-secondary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {article.content}
                        </p>

                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="w-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSOPClick(article);
                          }}
                        >
                          <HiMagnifyingGlass className="me-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SOP Detail Modal */}
      <Modal
        show={showSOPDetailModal}
        onHide={() => setShowSOPDetailModal(false)}
        size="lg"
        centered
        backdrop={isMerging ? "static" : true}
        keyboard={!isMerging}
      >
        <Modal.Header closeButton={!isMerging} className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            <HiDocumentText className="me-2" />
            SOP Details
            {isMerging && <span className="badge bg-warning ms-2">Processing...</span>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isMerging && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                zIndex: 1050,
                borderRadius: '0.375rem'
              }}>
              <div className="text-center">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-primary">Merging Articles</h5>
                <p className="">Please wait while we process and merge the duplicate articles...</p>
              </div>
            </div>
          )}
          {selectedSOP && (
            <div>
              <div className="mb-4">
                <h4 style={{ color: '#fffff', fontWeight: '600' }}>
                  {selectedSOP.title}
                </h4>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <small className="">
                      <HiUser className="me-1" />
                      Author: {selectedSOP.author}
                    </small>
                    <br />
                    <small className="">
                      <HiCalendarDays className="me-1" />
                      Created: {new Date(selectedSOP.dateCreated).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-info mb-1">{selectedSOP.views} views</div>
                    <br />
                    <span className="text-warning">⭐ {selectedSOP.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#495057', fontWeight: '600' }}>Content:</h6>
                <div
                  style={{
                    background: '#000000',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}
                >
                  {selectedSOP.content}
                </div>
              </div>

              <div className="alert" style={{ fontSize: '0.9rem' }}>
                <HiExclamationTriangle className="me-2" />
                <strong>Merge Action:</strong> This will combine this SOP with similar content and create a new comprehensive document.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSOPDetailModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={handleMergeSOP}
            disabled={isMerging}
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none'
            }}
          >
            {isMerging ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Merging Articles...
              </>
            ) : (
              <>
                Merge
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Merged SOP Display Modal */}
      <Modal
        show={showMergedSOPModal}
        onHide={() => setShowMergedSOPModal(false)}
        size="xl"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            <HiCheckCircle className="me-2" />
            {isEditingMergedSOP ? 'Edit Merged Document' : 'Successfully Merged Document'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {(mergedSOP || editableMergedSOP) && (
            <div>
              {/* Success/Edit Alert */}
              {!isEditingMergedSOP ? (
                <div className="alert d-flex align-items-center mb-4" role="alert">
                  <HiCheckCircle className="me-2" style={{ fontSize: '1.5rem' }} />
                  <div>
                    <strong>Merge Completed Successfully!</strong>
                    <br />
                    <small>
                      Combined {mergedSOP.mergedFrom} duplicate articles into a comprehensive guide.
                    </small>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                  <HiDocumentText className="me-2" style={{ fontSize: '1.5rem' }} />
                  <div>
                    <strong>Edit Mode Active</strong>
                    <br />
                    <small>
                      Make any necessary changes to the merged document before saving to the knowledge base.
                    </small>
                  </div>
                </div>
              )}

              {/* Document Header */}
              <div className="mb-4 p-3" style={{
                background: '#00000',
                borderRadius: '8px',
                border: '1px solid #90caf9'
              }}>
                {!isEditingMergedSOP ? (
                  <h3 style={{ color: '#1565c0', fontWeight: '700', marginBottom: '1rem' }}>
                    {mergedSOP.title}
                  </h3>
                ) : (
                  <div className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#1565c0' }}>Document Title:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editableMergedSOP.title}
                      onChange={(e) => handleEditableSOPChange('title', e.target.value)}
                      style={{ fontSize: '1.1rem', fontWeight: '600' }}
                    />
                  </div>
                )}

                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="">Category:</strong>
                      {!isEditingMergedSOP ? (
                        <span className="badge bg-primary ms-2">{mergedSOP.category}</span>
                      ) : (
                        <Form.Select
                          size="sm"
                          value={editableMergedSOP.category}
                          onChange={(e) => handleEditableSOPChange('category', e.target.value)}
                          className="ms-2"
                          style={{ width: '200px', display: 'inline-block' }}
                        >
                          <option value="Windows Administration">Windows Administration</option>
                          <option value="Network Management">Network Management</option>
                          <option value="Database Management">Database Management</option>
                          <option value="Security">Security</option>
                          <option value="Office Administration">Office Administration</option>
                          <option value="Cloud Services">Cloud Services</option>
                        </Form.Select>
                      )}
                    </div>
                    <div className="mb-2">
                      <strong className="">
                        <HiUser className="me-1" />
                        Created by:
                      </strong> {isEditingMergedSOP ? editableMergedSOP.author : mergedSOP.author}
                    </div>
                    <div className="mb-2">
                      <strong className="">
                        <HiCalendarDays className="me-1" />
                        Date:
                      </strong> {new Date(isEditingMergedSOP ? editableMergedSOP.dateCreated : mergedSOP.dateCreated).toLocaleDateString()}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="">Total Views:</strong>
                      <span className="badge bg-info ms-2">{(isEditingMergedSOP ? editableMergedSOP.views : mergedSOP.views).toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="">Average Rating:</strong>
                      <span className="text-warning ms-2">⭐ {isEditingMergedSOP ? editableMergedSOP.rating : mergedSOP.rating}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="">Sources Merged:</strong>
                      <span className="badge bg-success ms-2">{(isEditingMergedSOP ? editableMergedSOP.mergedFrom : mergedSOP.mergedFrom)} documents</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Merged Content */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: '#495057', fontWeight: '600', margin: '0' }}>
                    <HiDocumentText className="me-2" />
                    Comprehensive Merged Content:
                  </h5>
                  {isEditingMergedSOP && (
                    <small className="text-info">
                      <HiExclamationTriangle className="me-1" />
                      Editing Mode - Make your changes below
                    </small>
                  )}
                </div>

                {!isEditingMergedSOP ? (
                  <div
                    className="html-content"
                    style={{
                      background: '#000000',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      maxHeight: '500px',
                      overflowY: 'auto'
                    }}
                    dangerouslySetInnerHTML={{ __html: cleanHtml(mergedSOP.htmlContent || mergedSOP.content) }}
                  />
                ) : (
                  <div>
                    <div className="mb-2 p-2" style={{
                      background: '#000000',
                      borderRadius: '4px',
                      fontSize: '1.1rem',
                      border: '1px solid #90caf9'
                    }}>
                      <strong>📝 Formatting Guide:</strong>
                      <div style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
                        • <strong>**Bold Text**</strong> • <em>*Italic Text*</em> • <code>=== Main Heading ===</code> • <code>## Sub Heading</code> • <code>• Bullet Point</code>
                      </div>
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={20}
                      value={editableMergedSOP.editableTextContent || editableMergedSOP.content}
                      onChange={(e) => handleEditableSOPChange('content', e.target.value)}
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        minHeight: '500px',
                        border: '2px solid #90caf9',
                        borderRadius: '8px',
                        padding: '1rem'
                      }}
                      placeholder="Edit your content here using simple formatting:

=== Main Title ===

## Section Heading

**Bold text** for emphasis
*Italic text* for highlights

• Bullet point 1
• Bullet point 2

Regular paragraphs separated by blank lines..."
                    />
                  </div>
                )}
              </div>

              {/* Analysis Details Section */}
              {mergedSOP.details && (
                <div className="mb-4">
                  <h5 style={{ color: '#fff', fontWeight: '600', marginBottom: '1rem' }}>
                    <HiCog6Tooth className="me-2" />
                    Merge Analysis Details:
                  </h5>

                  {/* Grammar Corrections */}
                  {mergedSOP.details.grammar && mergedSOP.details.grammar.length > 0 && (
                    <div className="mb-3">
                      <h6 style={{ color: '#ffff', fontWeight: '600' }}>
                        <HiExclamationTriangle className="me-2" />
                        Grammar & Spelling Corrections:
                      </h6>
                      <div className="p-3 rounded" style={{ background: '#000', border: '1px solid #fed7d7' }}>
                        {mergedSOP.details.grammar.map((item, index) => (
                          <div key={index} className="mb-2">
                            {typeof item === 'object' && item !== null ? (
                              Object.entries(item).map(([key, value]) => (
                                key !== 'kb_article_1' && key !== 'kb_article_2' && (
                                  <div key={key} style={{ fontSize: '0.9rem' }}>
                                    <span style={{ color: '#fff', fontWeight: '600' }}>"{key}"</span>
                                    <span className="mx-2">→</span>
                                    <span style={{ color: '#fff', fontWeight: '600' }}>"{value}"</span>
                                    <small className=" ms-2">
                                      (Found in: {item.kb_article_1 || item.kb_article_2 || 'both articles'})
                                    </small>
                                  </div>
                                )
                              ))
                            ) : (
                              <div style={{ fontSize: '0.9rem', color: '#fff' }}>
                                {typeof item === 'string' ? item : String(item)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overlapping Content */}
                  {mergedSOP.details.overlapping && mergedSOP.details.overlapping.length > 0 && (
                    <div className="mb-3">
                      <h6 style={{ color: '#fff', fontWeight: '600' }}>
                        <HiArrowsPointingIn className="me-2" />
                        Overlapping Content:
                      </h6>
                      <div className="p-3 rounded" style={{ background: '#000000', border: '1px solid #b3d9ff' }}>
                        {mergedSOP.details.overlapping.map((item, index) => {
                          // Ensure item is a string
                          const itemString = typeof item === 'string' ? item : String(item);

                          return (
                            <div key={index} className="mb-2" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                              <div style={{ color: '#fff' }}>
                                <strong>#{index + 1}:</strong> {itemString.replace(/\[.*?\]/g, '')}
                              </div>
                              <small className="">
                                Source: {itemString.match(/\[(.*?)\]/)?.[1] || 'Multiple articles'}
                              </small>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Conflicting Content */}
                  {mergedSOP.details.conflicting && mergedSOP.details.conflicting.length > 0 && (
                    <div className="mb-3">
                      <h6 style={{ color: '#fff', fontWeight: '600' }}>
                        <HiExclamationTriangle className="me-2" />
                        Conflicting Content:
                      </h6>
                      <div className="p-3 rounded" style={{ background: '#000', border: '1px solid #ffecb3' }}>
                        {mergedSOP.details.conflicting.map((item, index) => (
                          <div key={index} className="mb-2" style={{ fontSize: '0.9rem', color: '#856404' }}>
                            {typeof item === 'string' ? item : String(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Complementary Content */}
                  {mergedSOP.details.complementary && mergedSOP.details.complementary.length > 0 && (
                    <div className="mb-3">
                      <h6 style={{ color: '#28a745', fontWeight: '600' }}>
                        <HiCheckCircle className="me-2" />
                        Complementary Content:
                      </h6>
                      <div className="p-3 rounded" style={{ background: '#000', border: '1px solid #c3e6cb' }}>
                        {mergedSOP.details.complementary.map((item, index) => (
                          <div key={index} className="mb-2" style={{ fontSize: '0.9rem', color: '#155724' }}>
                            {typeof item === 'string' ? item : String(item)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Original Sources Summary */}
              <div className="mb-3">
                <h6 style={{ color: '#fff', fontWeight: '600' }}>
                  <HiDocumentDuplicate className="me-2" />
                  Original Sources:
                </h6>
                <Row>
                  {mergedSOP.originalArticles?.map((article, index) => (
                    <Col md={6} key={article.id} className="mb-2">
                      <div
                        className="card border-light"
                        style={{ background: '#f8f9fa' }}
                      >
                        <div className="card-body py-2">
                          <h6 className="card-title mb-1" style={{ fontSize: '0.9rem' }}>
                            {article?.id} - {article.title}
                          </h6>
                          <small className=" d-block">
                            By {article.author} • {article.views} views • ⭐ {article.rating}
                          </small>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMergedSOPModal(false)}>
            Close
          </Button>

          {!isEditingMergedSOP ? (
            <>
              <Button
                variant="warning"
                onClick={handleEditMergedSOP}
                style={{
                  background: '#000',
                  border: 'none',
                  color: 'white'
                }}
              >
                <HiDocumentText className="me-2" />
                Edit Document
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveToKnowledgeBase}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="me-2" />
                    Save to Knowledge Base
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-secondary"
                onClick={handleCancelEdit}
              >
                Cancel Changes
              </Button>
              <Button
                variant="success"
                onClick={handleSaveEditedSOP}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none'
                }}
              >
                <HiCheckCircle className="me-2" />
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Merged SOPs List Modal */}
      <Modal show={showMergedListModal} onHide={() => setShowMergedListModal(false)} size="xl" centered>
        <Modal.Header closeButton className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            <HiArrowsPointingIn className="me-2" />
            All Merged SOPs ({filteredMergedSOPs.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {filteredMergedSOPs.length === 0 ? (
            <div className="text-center py-5">
              <HiArrowsPointingIn style={{ fontSize: '4rem', color: '#6c757d', opacity: 0.3 }} />
              <h5 className="mt-3 ">No Merged SOPs Yet</h5>
              <p className="">
                Merge duplicate articles to see them here. Click on "Duplicate Articles" to get started.
              </p>
            </div>
          ) : (
            <div>
              {/* Summary Stats */}
              <div className="mb-4 p-3 rounded" style={{ background: '#000', border: '1px solid #28a745' }}>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="mb-1" style={{ color: '#28a745', fontWeight: 'bold' }}>
                        {filteredMergedSOPs.length}
                      </h4>
                      <small className="">Total Merged SOPs</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="mb-1" style={{ color: '#28a745', fontWeight: 'bold' }}>
                        {filteredMergedSOPs.reduce((sum, sop) => sum + sop.mergedFrom, 0)}
                      </h4>
                      <small className="">Sources Combined</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="mb-1" style={{ color: '#28a745', fontWeight: 'bold' }}>
                        {filteredMergedSOPs.reduce((sum, sop) => sum + sop.views, 0).toLocaleString()}
                      </h4>
                      <small className="">Total Views</small>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h4 className="mb-1" style={{ color: '#28a745', fontWeight: 'bold' }}>
                        {filteredMergedSOPs.length > 0 ? (filteredMergedSOPs.reduce((sum, sop) => sum + parseFloat(sop.rating), 0) / filteredMergedSOPs.length).toFixed(1) : '0.0'}
                      </h4>
                      <small className="">Avg Rating ⭐</small>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Merged SOPs List */}
              <Row>
                {filteredMergedSOPs.map((sop, index) => (
                  <Col lg={6} className="mb-4" key={sop.id}>
                    <div
                      className="card h-100"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid #28a745',
                        borderRadius: '12px'
                      }}
                      onClick={() => {
                        setSelectedSOP(sop);
                        setShowSOPDetailModal(true);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(40, 167, 69, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      <div className="card-header" style={{
                        background: '#33415580',
                        color: 'white',
                        borderRadius: '10px 10px 0 0'
                      }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0" style={{ fontWeight: '600' }}>
                            <HiArrowsPointingIn className="me-2" />
                            Merged SOP #{index + 1}
                          </h6>
                          <span className="badge bg-light text-dark">
                            {sop.mergedFrom} sources
                          </span>
                        </div>
                      </div>

                      <div className="card-body">
                        <h5 className="card-title mb-3" style={{
                          color: '#333',
                          fontWeight: '600',
                          lineHeight: '1.3'
                        }}>
                          {sop?.id} - {sop.title}
                        </h5>

                        <div className="mb-3">
                          <span className="badge bg-primary me-2">{sop.category}</span>
                          <span className="badge bg-success me-2">{sop.views} views</span>
                          <span className="badge bg-warning text-dark">⭐ {sop.rating}</span>
                        </div>

                        <div className="mb-3">
                          <Row>
                            <Col xs={6}>
                              <small className=" d-block">
                                <HiUser className="me-1" />
                                {sop.author}
                              </small>
                            </Col>
                            <Col xs={6}>
                              <small className=" d-block">
                                <HiCalendarDays className="me-1" />
                                {new Date(sop.mergedDate).toLocaleDateString()}
                              </small>
                            </Col>
                          </Row>
                        </div>

                        <p className="card-text" style={{
                          fontSize: '1.1rem',
                          color: 'var(--text-secondary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.4'
                        }}>
                          {sop.content.split('\n')[0].replace(/=== Source \d+: /, '')}...
                        </p>
                      </div>

                      <div className="card-footer" style={{ borderRadius: '0 0 10px 10px' }}>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-success">
                            <HiCheckCircle className="me-1" />
                            Successfully Merged
                          </small>
                          <small className="">
                            Click to view details
                          </small>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMergedListModal(false)}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              setShowMergedListModal(false);
              setShowDuplicateModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none'
            }}
          >
            <HiDocumentDuplicate className="me-2" />
            Merge More Duplicates
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Low Scoring Articles Modal */}
      <Modal show={showLowScoringModal} onHide={() => setShowLowScoringModal(false)} size="xl" centered>
        <Modal.Header closeButton className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            <HiChartBarSquare className="me-2" />
            Low Scoring Articles ({filteredLowScoringArticles.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="mb-3">
            <div className="alert d-flex align-items-center" role="alert">
              <HiExclamationTriangle className="me-2" style={{ fontSize: '1.5rem' }} />
              <div>
                <strong>Articles Need Improvement</strong>
                <br />
                <small>These articles have ratings below 3 stars and require refinement to improve quality.</small>
              </div>
            </div>
          </div>

          <Row>
            {filteredLowScoringArticles.map((article, index) => (
              <Col lg={4} md={6} className="mb-4" key={article.id}>
                <div
                  className="card h-100"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid #feca57',
                    borderRadius: '12px'
                  }}
                  onClick={() => handleLowScoringArticleClick(article)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(254, 202, 87, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="card-header" style={{
                    background: '#33415580',
                    color: 'white',
                    borderRadius: '10px 10px 0 0'
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0" style={{ fontWeight: '600' }}>
                        <HiChartBarSquare className="me-2" />
                        Low Scoring Article
                      </h6>
                      <span className="badge bg-light text-dark">
                        ⭐ {article.rating}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h5 className="card-title mb-3" style={{
                      color: '#333',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}>
                      {article?.id} - {article.title}
                    </h5>

                    <div className="mb-3">
                      <span className="badge bg-secondary me-2">{article.category}</span>
                      <span className="badge bg-info me-2">{article.views} views</span>
                      <span className="badge bg-warning text-dark">Rating: {article.rating}</span>
                    </div>

                    <div className="mb-3">
                      <Row>
                        <Col xs={6}>
                          <small className=" d-block">
                            <HiUser className="me-1" />
                            {article.author}
                          </small>
                        </Col>
                        <Col xs={6}>
                          <small className=" d-block">
                            <HiCalendarDays className="me-1" />
                            {new Date(article.dateCreated).toLocaleDateString()}
                          </small>
                        </Col>
                      </Row>
                    </div>

                    <p className="card-text" style={{
                      fontSize: '1.1rem',
                      color: 'var(--text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}>
                      {article.content.replace(/\n/g, ' ').substring(0, 100)}...
                    </p>
                  </div>

                  <div className="card-footer" style={{ borderRadius: '0 0 10px 10px' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-warning">
                        <HiExclamationTriangle className="me-1" />
                        Needs Improvement
                      </small>
                      <small className="">
                        Click to refine
                      </small>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLowScoringModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Low Scoring Article Detail Modal */}
      <Modal show={showLowScoringDetailModal} onHide={() => setShowLowScoringDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            <HiDocumentText className="me-2" />
            Article Details & Refinement
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLowScoringArticle && (
            <div>
              <div className="mb-4">
                <h4 style={{ color: '#fff', fontWeight: '600' }}>
                  {selectedLowScoringArticle.title}
                </h4>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <small className="">
                      <HiUser className="me-1" />
                      Author: {selectedLowScoringArticle.author}
                    </small>
                    <br />
                    <small className="">
                      <HiCalendarDays className="me-1" />
                      Created: {new Date(selectedLowScoringArticle.dateCreated).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-info mb-1">{selectedLowScoringArticle.views} views</div>
                    <br />
                    <span className="text-warning">⭐ {selectedLowScoringArticle.rating}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 style={{ color: '#495057', fontWeight: '600' }}>Current Content:</h6>
                <div
                  style={{
                    background: '#000000',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    whiteSpace: 'pre-line',
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}
                >
                  {selectedLowScoringArticle.content}
                </div>
              </div>

              <div className="alert" style={{ fontSize: '0.9rem' }}>
                <HiExclamationTriangle className="me-2" />
                <strong>Refine Action:</strong> This will improve the article content using AI to enhance clarity, structure, and completeness.
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLowScoringDetailModal(false)}>
            Close
          </Button>
          <Button
            variant="warning"
            onClick={handleRefineArticle}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
              border: 'none',
              color: 'white'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Refining...
              </>
            ) : (
              <>
                <HiCog6Tooth className="me-2" />
                Refine Article
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Refined Article Modal */}
      <Modal show={showRefinedArticleModal} onHide={() => setShowRefinedArticleModal(false)} size="xl" centered>
        <Modal.Header className='bg-gradient-to-br from-neon-blue to-royal-500' closeButton style={{ color: 'white' }}>
          <Modal.Title>
            <HiCheckCircle className="me-2" />
            {isEditingRefinedArticle ? 'Edit Refined Article' : 'Refined Article Preview'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {(refinedArticle || editableRefinedArticle) && (
            <div>
              {/* Success/Edit Alert */}
              {!isEditingRefinedArticle ? (
                <div className="alert d-flex align-items-center mb-4" role="alert">
                  <HiCheckCircle className="me-2" style={{ fontSize: '1.5rem' }} />
                  <div>
                    <strong>Article Refinement Completed!</strong>
                    <br />
                    <small>
                      The article has been enhanced with improved structure and content quality.
                    </small>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
                  <HiDocumentText className="me-2" style={{ fontSize: '1.5rem' }} />
                  <div>
                    <strong>Edit Mode Active</strong>
                    <br />
                    <small>
                      Make any necessary changes to the refined article before storing.
                    </small>
                  </div>
                </div>
              )}

              {/* Document Header */}
              <div className="mb-4 p-3" style={{
                background: '#000000',
                borderRadius: '8px',
                border: '1px solid #90caf9'
              }}>
                {!isEditingRefinedArticle ? (
                  <h3 style={{ color: '#1565c0', fontWeight: '700', marginBottom: '1rem' }}>
                    {refinedArticle.title}
                  </h3>
                ) : (
                  <div className="mb-3">
                    <Form.Label style={{ fontWeight: '600', color: '#1565c0' }}>Article Title:</Form.Label>
                    <Form.Control
                      type="text"
                      value={editableRefinedArticle.title}
                      onChange={(e) => setEditableRefinedArticle(prev => ({ ...prev, title: e.target.value }))}
                      style={{ fontSize: '1.1rem', fontWeight: '600' }}
                    />
                  </div>
                )}

                <Row>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="">Category:</strong>
                      <span className="badge bg-primary ms-2">{(isEditingRefinedArticle ? editableRefinedArticle : refinedArticle).category}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="">
                        <HiUser className="me-1" />
                        Author:
                      </strong> {(isEditingRefinedArticle ? editableRefinedArticle : refinedArticle).author}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-2">
                      <strong className="">Views:</strong>
                      <span className="badge bg-info ms-2">{(isEditingRefinedArticle ? editableRefinedArticle : refinedArticle).views}</span>
                    </div>
                    <div className="mb-2">
                      <strong className="">Original Rating:</strong>
                      <span className="text-warning ms-2">⭐ {(isEditingRefinedArticle ? editableRefinedArticle : refinedArticle).rating}</span>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Refined Content */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ color: '#495057', fontWeight: '600', margin: '0' }}>
                    <HiDocumentText className="me-2" />
                    Refined Content:
                  </h5>
                  {isEditingRefinedArticle && (
                    <small className="text-info">
                      <HiExclamationTriangle className="me-1" />
                      Editing Mode - Make your changes below
                    </small>
                  )}
                </div>

                {!isEditingRefinedArticle ? (
                  <div
                    style={{
                      background: '#000000',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef',
                      maxHeight: '500px',
                      overflowY: 'auto'
                    }}
                    dangerouslySetInnerHTML={{ __html: cleanHtml(refinedArticle.htmlContent) }}
                  />
                ) : (
                  <div>
                    <div className="mb-2 p-2" style={{
                      background: '#000000',
                      borderRadius: '4px',
                      fontSize: '1.1rem',
                      border: '1px solid #90caf9'
                    }}>
                      <strong>📝 Formatting Guide:</strong>
                      <div style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
                        • <strong>**Bold Text**</strong> • <em>*Italic Text*</em> • <code>=== Main Heading ===</code> • <code>## Sub Heading</code> • <code>• Bullet Point</code>
                      </div>
                    </div>
                    <Form.Control
                      as="textarea"
                      rows={20}
                      value={editableRefinedArticle.editableTextContent || editableRefinedArticle.content}
                      onChange={(e) => setEditableRefinedArticle(prev => ({ ...prev, editableTextContent: e.target.value }))}
                      style={{
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        minHeight: '500px',
                        border: '2px solid #90caf9',
                        borderRadius: '8px',
                        padding: '1rem'
                      }}
                      placeholder="Edit your content here using simple formatting:

=== Main Title ===

## Section Heading

**Bold text** for emphasis
*Italic text* for highlights

• Bullet point 1
• Bullet point 2

Regular paragraphs separated by blank lines..."
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRefinedArticleModal(false)}>
            Close
          </Button>

          {!isEditingRefinedArticle ? (
            <>
              <Button
                variant="warning"
                onClick={() => {
                  // Convert HTML content to readable text for editing
                  const textContent = htmlToText(refinedArticle.htmlContent || refinedArticle.content);
                  setEditableRefinedArticle({
                    ...refinedArticle,
                    content: textContent,
                    editableTextContent: textContent
                  });
                  setIsEditingRefinedArticle(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #ffc107 0%, #ffb347 100%)',
                  border: 'none',
                  color: 'white'
                }}
              >
                <HiDocumentText className="me-2" />
                Edit Article
              </Button>
              <Button
                variant="primary"
                onClick={handleStoreRefinedArticle}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Storing...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="me-2" />
                    Store Article
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-secondary"
                onClick={() => setIsEditingRefinedArticle(false)}
              >
                Cancel Changes
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  // Convert the edited text back to HTML format
                  const htmlContent = textToHtml(editableRefinedArticle.editableTextContent || editableRefinedArticle.content);
                  const updatedArticle = {
                    ...editableRefinedArticle,
                    content: editableRefinedArticle.editableTextContent || editableRefinedArticle.content,
                    htmlContent: htmlContent
                  };
                  setRefinedArticle(updatedArticle);
                  setIsEditingRefinedArticle(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none'
                }}
              >
                <HiCheckCircle className="me-2" />
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} centered>
        <Modal.Header closeButton style={{
          background: confirmationStatus === 201 ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)',
          color: 'white'
        }}>
          <Modal.Title>
            {confirmationStatus === 201 ? <HiCheckCircle className="me-2" /> : <HiXCircle className="me-2" />}
            {confirmationStatus === 201 ? 'Success' : 'Error'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`alert ${confirmationStatus === 201 ? 'alert-success' : 'alert-danger'} d-flex align-items-center`} role="alert">
            {confirmationStatus === 201 ? <HiCheckCircle className="me-2" style={{ fontSize: '1.5rem' }} /> : <HiXCircle className="me-2" style={{ fontSize: '1.5rem' }} />}
            <div>
              {confirmationMessage}
            </div>
          </div>

          {confirmationStatus === 201 && (
            <div className="text-center mt-3">
              <p className="text-white mb-0">
                <HiCheckCircle className="me-1" />
                Article has been successfully stored in the knowledge base.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={confirmationStatus === 201 ? "success" : "danger"}
            onClick={() => setShowConfirmationModal(false)}
          >
            {confirmationStatus === 201 ? "Great!" : "Close"}
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Article details popup */}


      <Modal
        show={showArticleDetails}
        onHide={() => {
          setShowArticleDetails(false)
          setCreatedKbArticle(null)
          setEditableCreatedArticle();
          setIsEditingCreatedArticle(false);
        }}
        size="xl"
        centered
      >
        <Modal.Header closeButton={!isMerging} className='bg-gradient-to-br from-neon-blue to-royal-500' style={{ color: 'white' }}>
          <Modal.Title>
            {selectedArtcle.length && !createdKbArticle ? "Ticket Details" : 'Article Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', position: 'relative' }}>

          {console.log(selectedArtcle[0], createdKbArticle, 'test')}

          {selectedArtcle.length && !createdKbArticle ? <div className='p-5'>
            <div className='d-flex justify-content-between'>
              <h5> Incident ID: {selectedArtcle[0].incidents[0]} </h5>
              <div className='d-flex'>
                <h5>Category : </h5>
                <p className='text-sm'> {selectedArtcle[0].category}</p>
              </div>
            </div>
            <h3 className='pt-2'>Short Description</h3>
            <p className='text-sm'>{selectedArtcle[0].short_description}</p>
            <h3 className='pt-2'>Description</h3>
            <p className='text-sm'>{selectedArtcle[0].description}</p>
            <h3 className='pt-2'>Resolution Notes</h3>
            <p className='text-sm'>{selectedArtcle[0].resolution_notes}</p>

          </div> : !isEditingCreatedArticle ? <> <div
            style={{
              background: '#000000',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              maxHeight: '500px',
              overflowY: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: cleanHtml(createdKbArticle?.data || createdKbArticle) }}
          /></> : <>
            <div>
              <div className="mb-2 p-2" style={{
                background: '#000000',
                borderRadius: '4px',
                fontSize: '1.1rem',
                border: '1px solid #90caf9'
              }}>
                <strong>📝 Formatting Guide:</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '1.1rem' }}>
                  • <strong>**Bold Text**</strong> • <em>*Italic Text*</em> • <code>=== Main Heading ===</code> • <code>## Sub Heading</code> • <code>• Bullet Point</code>
                </div>
              </div>
              <Form.Control
                as="textarea"
                rows={20}
                value={editableCreatedArticle}
                onChange={(e) => setEditableCreatedArticle(e.target.value)}
                style={{
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  minHeight: '500px',
                  border: '2px solid #90caf9',
                  borderRadius: '8px',
                  padding: '1rem'
                }}
                placeholder="Edit your content here using simple formatting:

=== Main Title ===

## Section Heading

**Bold text** for emphasis
*Italic text* for highlights

• Bullet point 1
• Bullet point 2

Regular paragraphs separated by blank lines..."
              />
            </div>
          </>}

        </Modal.Body>
        <Modal.Footer>
          {!createdKbArticle ? <Button variant="secondary" disabled={isLoading} onClick={async () => {
            // setShowAddModal(true);
            try {
              setIsLoading(true);
              const apiUserName = 'rest'
              const apiPass = '!fi$5*4KlHDdRwdbup%ix'

              const response = await axios.post(
                'http://172.31.6.97:6500/llm/api/v1/refine_kb_articles',
                {
                  kb_article: `short description - ${selectedArtcle[0].short_description}- Description - ${selectedArtcle[0].description}-Resolution notes-${selectedArtcle[0].resolution_notes}`
                },
                {
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  auth: {
                    username: apiUserName,
                    password: apiPass
                  }
                }
              );

              const data = await response.data;
              // return data;
              setCreatedKbArticle(data)
            } catch (error) {
              console.error('Error calling refine API:', error);
              throw error;
            } finally {
              setIsLoading(false);
              // setShowAddModal(false);
            }
          }}>
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                <HiCheckCircle className="me-2" />
                Create Article
              </>
            )}
          </Button> : <></>}
          {!isEditingCreatedArticle ? (
            <>
              <Button
                variant="warning"
                onClick={() => {
                  // Convert HTML content to readable text for editing
                  const textContent = htmlToText(createdKbArticle?.data);
                  setEditableCreatedArticle(textContent);
                  setIsEditingCreatedArticle(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #ffc107 0%, #ffb347 100%)',
                  border: 'none',
                  color: 'white'
                }}
              >
                <HiDocumentText className="me-2" />
                Edit Article
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSavingCreatedKbArtilce(true)
                  handleStoreCreatedArticle(selectedArtcle[0]?.category, selectedArtcle)
                }}
                disabled={savingCreatedKbArtilce}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                {savingCreatedKbArtilce ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="me-2" />
                    Save Article
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline-secondary"
                onClick={() => setIsEditingCreatedArticle(false)}
              >
                Cancel Changes
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  // Convert the edited text back to HTML format
                  const htmlContent = textToHtml(editableCreatedArticle);
                  // const updatedArticle = {
                  //   ...editableRefinedArticle,
                  //   content: editableRefinedArticle.editableTextContent || editableRefinedArticle.content,
                  //   htmlContent: htmlContent
                  // };
                  setCreatedKbArticle(htmlContent);
                  setIsEditingCreatedArticle(false);
                }}
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  border: 'none'
                }}
              >
                <HiCheckCircle className="me-2" />
                Save Changes
              </Button>
            </>
          )}

        </Modal.Footer>
      </Modal>


      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideLeftToRight {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.33%, 0, 0);
          }
        }

        .categories-carousel {
          animation: slideLeftToRight 15s linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        .categories-carousel-container:hover .categories-carousel {
          animation-play-state: paused;
        }

        .category-performance-card {
          transform: translateZ(0);
          will-change: transform, box-shadow;
        }

        .category-performance-card:hover {
          transform: translateY(-2px) scale(1.03) translateZ(0);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          border-color: var(--primary-color) !important;
        }

        .category-performance-card:active {
          transform: translateY(0) scale(1.01) translateZ(0);
          transition: all 0.1s ease;
        }

        .theme-fade-in {
          animation: fadeIn 0.6s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .theme-kpi-card {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .article-item:hover {
          transform: translateX(3px) scale(1.02);
        }

        /* Custom scrollbar */
        .theme-card-body::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .theme-card-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .theme-card-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        .theme-card-body::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .theme-card-body::-webkit-scrollbar-corner {
          background: #f1f1f1;
        }

        /* Ensure table headers and cells don't wrap */
        .table th {
          white-space: nowrap !important;
        }
        
        .table td {
          white-space: nowrap !important;
        }
        
        /* Enhanced table scrolling */
        .table-container {
          overflow-x: auto;
          overflow-y: auto;
        }

        /* HTML content styling */
        .html-content h1 {
          font-size: 1.5rem;
          color: #0056b3;
          margin-bottom: 1rem;
          margin-top: 1rem;
        }

        .html-content h2 {
          font-size: 1.25rem;
          color: #0056b3;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }

        .html-content h3 {
          font-size: 1.1rem;
          color: #0056b3;
          margin-bottom: 0.5rem;
          margin-top: 1rem;
        }

        .html-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .html-content ul {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .html-content ul li {
          margin-bottom: 0.25rem;
          list-style-type: square;
        }

        .html-content a {
          color: #007bff;
          text-decoration: none;
        }

        .html-content a:hover {
          text-decoration: underline;
        }

        /* Custom tooltip styling for table cells */
        .table td[title]:hover {
          position: relative;
          cursor: help;
        }

        /* Badge hover effects */
        .badge[title]:hover {
          opacity: 0.9;
          transform: scale(1.05);
          transition: all 0.2s ease;
        }

        /* Sortable table headers */
        .table th[onClick] {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .table th[onClick]:hover {
          background-color: #e9ecef !important;
        }

        /* Search and filter controls */
        .form-control:focus,
        .form-select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>


    </Container>
  );
};

export default KnowledgeAssist; 