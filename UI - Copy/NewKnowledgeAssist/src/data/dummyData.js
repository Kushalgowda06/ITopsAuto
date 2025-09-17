export const categories = [
  {
    id: 1,
    name: 'Windows',
    icon: 'FaWindows',
    description: 'Windows administration, troubleshooting, and configuration guides',
    color: '#0078d4',
    count: 3
  },
  {
    id: 2,
    name: 'Linux',
    icon: 'FaLinux',
    description: 'Linux system administration, shell scripting, and server management',
    color: '#f7d117',
    count: 2
  },
  {
    id: 3,
    name: 'Network',
    icon: 'HiGlobeAlt',
    description: 'Network configuration, troubleshooting, and security protocols',
    color: '#28a745',
    count: 2
  },
  {
    id: 4,
    name: 'Database',
    icon: 'HiCircleStack',
    description: 'Database management, optimization, and backup procedures',
    color: '#17a2b8',
    count: 2
  },

  {
    id: 6,
    name: 'AWS',
    icon: 'FaAws',
    description: 'Amazon Web Services deployment and management guides',
    color: '#ff9900',
    count: 2
  },

  {
    id: 8,
    name: 'GCP',
    icon: 'SiGooglecloud',
    description: 'Google Cloud Platform services and deployment procedures',
    color: '#4285f4',
    count: 3
  },

];

export const sopsData = {
  1: [ // Windows
    {
      id: 101,
      title: 'Windows Server 2022 Installation Guide',
      description: 'Complete step-by-step guide for installing Windows Server 2022',
      category: 'Installation',
      priority: 'High',
      lastUpdated: '2023-12-01',
      author: 'John Smith',
      tags: ['windows', 'server', 'installation'],
      steps: [
        'Download Windows Server 2022 ISO from Microsoft',
        'Create bootable USB drive using Rufus or Windows Media Creation Tool',
        'Boot from USB and follow installation wizard',
        'Configure initial server settings and roles',
        'Install latest updates and security patches',
        'Configure Windows Defender and firewall settings'
      ]
    },
    {
      id: 102,
      title: 'Active Directory User Management',
      description: 'Managing users, groups, and permissions in Active Directory',
      category: 'Administration',
      priority: 'Medium',
      lastUpdated: '2023-11-28',
      author: 'Sarah Johnson',
      tags: ['windows', 'active-directory', 'users'],
      steps: [
        'Open Active Directory Users and Computers',
        'Navigate to appropriate Organizational Unit',
        'Right-click and select "New User"',
        'Enter user details and password policy',
        'Assign user to appropriate groups',
        'Configure user permissions and access rights'
      ]
    },
    {
      id: 103,
      title: 'Windows Performance Troubleshooting',
      description: 'Diagnosing and resolving Windows performance issues',
      category: 'Troubleshooting',
      priority: 'High',
      lastUpdated: '2023-11-25',
      author: 'Mike Davis',
      tags: ['windows', 'performance', 'troubleshooting'],
      steps: [
        'Open Task Manager and identify resource usage',
        'Check Windows Event Viewer for errors',
        'Run Performance Monitor to analyze system metrics',
        'Use Resource Monitor for detailed process analysis',
        'Check disk space and run disk cleanup',
        'Update drivers and run Windows updates'
      ]
    }
  ],
  2: [ // Linux
    {
      id: 201,
      title: 'Ubuntu Server Setup and Hardening',
      description: 'Complete guide for setting up and securing Ubuntu Server',
      category: 'Installation',
      priority: 'High',
      lastUpdated: '2023-12-02',
      author: 'Alex Chen',
      tags: ['linux', 'ubuntu', 'security'],
      steps: [
        'Install Ubuntu Server from ISO',
        'Configure network settings and SSH',
        'Update system packages: sudo apt update && sudo apt upgrade',
        'Configure firewall with ufw',
        'Set up fail2ban for intrusion prevention',
        'Configure automatic security updates'
      ]
    },
    {
      id: 202,
      title: 'Apache Web Server Configuration',
      description: 'Setting up and configuring Apache web server on Linux',
      category: 'Web Server',
      priority: 'Medium',
      lastUpdated: '2023-11-30',
      author: 'Lisa Wang',
      tags: ['linux', 'apache', 'web-server'],
      steps: [
        'Install Apache: sudo apt install apache2',
        'Start and enable Apache service',
        'Configure virtual hosts in /etc/apache2/sites-available/',
        'Enable SSL/TLS with Let\'s Encrypt',
        'Configure security headers and modules',
        'Set up log rotation and monitoring'
      ]
    }
  ],
  3: [ // Network
    {
      id: 301,
      title: 'VLAN Configuration on Cisco Switches',
      description: 'Step-by-step guide for configuring VLANs on Cisco switches',
      category: 'Switching',
      priority: 'Medium',
      lastUpdated: '2023-11-29',
      author: 'Robert Kim',
      tags: ['network', 'cisco', 'vlan'],
      steps: [
        'Connect to switch via console or SSH',
        'Enter global configuration mode',
        'Create VLAN: vlan [vlan-id]',
        'Assign name to VLAN: name [vlan-name]',
        'Configure access ports: switchport mode access',
        'Assign ports to VLAN: switchport access vlan [vlan-id]'
      ]
    },
    {
      id: 302,
      title: 'Firewall Rule Configuration',
      description: 'Configuring firewall rules for network security',
      category: 'Security',
      priority: 'High',
      lastUpdated: '2023-12-01',
      author: 'Emily Taylor',
      tags: ['network', 'firewall', 'security'],
      steps: [
        'Access firewall management interface',
        'Define network objects and groups',
        'Create security policies with appropriate rules',
        'Configure NAT policies if required',
        'Test firewall rules with traffic simulation',
        'Monitor logs and adjust rules as needed'
      ]
    }
  ],
  4: [ // Database
    {
      id: 401,
      title: 'MySQL Database Backup and Recovery',
      description: 'Comprehensive guide for MySQL backup and recovery procedures',
      category: 'Backup',
      priority: 'High',
      lastUpdated: '2023-12-03',
      author: 'David Brown',
      tags: ['database', 'mysql', 'backup'],
      steps: [
        'Create backup using mysqldump command',
        'Set up automated backup scripts with cron',
        'Verify backup integrity and test restoration',
        'Configure binary log for point-in-time recovery',
        'Document backup retention policies',
        'Test disaster recovery procedures regularly'
      ]
    },
    {
      id: 402,
      title: 'PostgreSQL Performance Tuning',
      description: 'Optimizing PostgreSQL database performance',
      category: 'Performance',
      priority: 'Medium',
      lastUpdated: '2023-11-27',
      author: 'Maria Garcia',
      tags: ['database', 'postgresql', 'performance'],
      steps: [
        'Analyze query performance with EXPLAIN',
        'Configure postgresql.conf parameters',
        'Optimize memory settings (shared_buffers, work_mem)',
        'Create appropriate indexes for queries',
        'Set up connection pooling with pgBouncer',
        'Monitor database metrics and slow queries'
      ]
    }
  ],
  6: [ // AWS
    {
      id: 601,
      title: 'EC2 Instance Deployment and Configuration',
      description: 'Launching and configuring EC2 instances on AWS',
      category: 'Compute',
      priority: 'Medium',
      lastUpdated: '2023-12-02',
      author: 'Kevin Zhang',
      tags: ['aws', 'ec2', 'cloud'],
      steps: [
        'Log into AWS Management Console',
        'Navigate to EC2 service',
        'Click "Launch Instance" and select AMI',
        'Choose instance type and configure security groups',
        'Configure storage and launch instance',
        'Connect to instance and install required software'
      ]
    },
    {
      id: 602,
      title: 'S3 Bucket Security Configuration',
      description: 'Securing S3 buckets with proper access controls',
      category: 'Storage',
      priority: 'High',
      lastUpdated: '2023-11-24',
      author: 'Amanda Rodriguez',
      tags: ['aws', 's3', 'security'],
      steps: [
        'Create S3 bucket with appropriate naming',
        'Configure bucket policy for access control',
        'Enable versioning and MFA delete',
        'Set up server-side encryption',
        'Configure CloudTrail for audit logging',
        'Enable Access Logging for monitoring'
      ]
    }
  ],
  8: [ // GCP
    {
      id: 801,
      title: 'Google Compute Engine VM Setup',
      description: 'Complete guide for setting up Google Compute Engine virtual machines',
      category: 'Compute',
      priority: 'High',
      lastUpdated: '2023-12-01',
      author: 'Sarah Chen',
      tags: ['gcp', 'compute-engine', 'vm'],
      steps: [
        'Access Google Cloud Console',
        'Navigate to Compute Engine > VM instances',
        'Click "Create Instance" and configure basic settings',
        'Select machine type and operating system',
        'Configure networking and firewall rules',
        'Set up persistent disks and storage',
        'Configure monitoring and logging',
        'Review and create the instance'
      ]
    },
    {
      id: 802,
      title: 'GKE Cluster Deployment',
      description: 'Deploying and managing Google Kubernetes Engine clusters',
      category: 'Kubernetes',
      priority: 'High',
      lastUpdated: '2023-11-28',
      author: 'Michael Zhang',
      tags: ['gcp', 'gke', 'kubernetes'],
      steps: [
        'Enable GKE API in Google Cloud Console',
        'Create new GKE cluster with desired configuration',
        'Configure node pools and auto-scaling',
        'Set up networking and security policies',
        'Deploy applications using kubectl',
        'Configure ingress and load balancing',
        'Monitor cluster health and performance'
      ]
    },
    {
      id: 803,
      title: 'Cloud Storage Bucket Management',
      description: 'Managing Google Cloud Storage buckets and objects',
      category: 'Storage',
      priority: 'Medium',
      lastUpdated: '2023-12-03',
      author: 'Lisa Park',
      tags: ['gcp', 'cloud-storage', 'buckets'],
      steps: [
        'Access Cloud Storage in Google Cloud Console',
        'Create new storage bucket with appropriate settings',
        'Configure bucket permissions and IAM policies',
        'Upload objects and set object-level permissions',
        'Configure lifecycle policies for cost optimization',
        'Set up versioning and backup strategies',
        'Monitor storage usage and billing'
      ]
    }
  ]
}; 