export const categories = [
  {
    id: 1,
    name: 'Windows',
    icon: 'FaWindows',
    description: 'Windows administration, troubleshooting, and configuration guides',
    color: '#0078d4',
    count: 1
  },
  {
    id: 2,
    name: 'Linux',
    icon: 'FaLinux',
    description: 'Linux system administration, shell scripting, and server management',
    color: '#f7d117',
    count: 1
  },
  {
    id: 3,
    name: 'Software',
    icon: 'HiGlobeAlt',
    description: 'Network configuration, troubleshooting, and security protocols',
    color: '#28a745',
    count: 4
  },
  {
    id: 4,
    name: 'Database',
    icon: 'HiCircleStack',
    description: 'Database management, optimization, and backup procedures',
    color: '#17a2b8',
    count: 1
  },

  {
    id: 6,
    name: 'Cloud',
    icon: 'FaCloud',
    description: 'Amazon Web Services deployment and management guides',
    color: '#ff9900',
    count: 4
  },
];

export const sopsData = {
  1: [ // Windows
    {
      id: 1001,
      title: 'Comprehensive Guide to Fix High Disk Usage in Windows Caused by Search Indexing and SysMain',
      description: 'Complete step-by-step guide for installing Windows Server 2022',
      content: 'Issue Summary:\n High disk usage in Windows can significantly degrade system performance. Two common culprits are Windows Search Indexing and SysMain (Superfetch) services, which run in the background to optimize user experience but may overwhelm systems with limited resources.\n Symptoms:\n • Disk usage near 100% in Task Manager.\n • System lag, slow boot times, and overheating.\n • Unresponsive applications.\n Root Causes:\n • Windows Search Indexing scans files to improve search speed.\n • SysMain (Superfetch) preloads frequently used apps into memory.\n Unified Resolution Steps:\n 1. Disable Windows Search Indexing\n • Open Run (Win + R) > type services.msc.\n • Locate Windows Search > Right-click > Properties.\n • Set Startup type to Disabled > Click Stop.\n 2. Disable SysMain (Superfetch)\n • In the same Services window, locate SysMain.\n • Right-click > Properties > Set Startup type to Disabled > Click Stop.\n 3. Modify Indexing Options\n • Go to Control Panel > Indexing Options.\n • Click Modify > Uncheck folders that don’t need indexing.\n 4. Monitor System Performance\n • Use Task Manager to observe disk usage.\n • Reboot and test responsiveness.\n 5. Optional Hardware Upgrade\n • Upgrade to SSD for better disk I/O performance.\n • Increase RAM to reduce reliance on disk caching.\n Additional Notes:\n • Disabling these services may slightly impact search and app launch speed but improves overall system responsiveness.\n • Re-enable services if needed for specific use cases.\n',
      category: 'Windows Administration',
      author: 'System (Auto-merged)',
      dateCreated: '2024-01-20',
      priority: 'High',
      lastUpdated: '2023-12-01',
      tags: ['windows', 'server', 'installation'],
      views: 434,
      rating: '4.2',
      mergedFrom: 2,
      mergedDate: '2024-01-20',
      steps: [
        'Issue Summary:\n High disk usage in Windows can significantly degrade system performance. Two common culprits are Windows Search Indexing and SysMain (Superfetch) services, which run in the background to optimize user experience but may overwhelm systems with limited resources.\n Symptoms:\n • Disk usage near 100% in Task Manager.\n • System lag, slow boot times, and overheating.\n • Unresponsive applications.\n Root Causes:\n • Windows Search Indexing scans files to improve search speed.\n • SysMain (Superfetch) preloads frequently used apps into memory.\n Unified Resolution Steps:\n 1. Disable Windows Search Indexing\n • Open Run (Win + R) > type services.msc.\n • Locate Windows Search > Right-click > Properties.\n • Set Startup type to Disabled > Click Stop.\n 2. Disable SysMain (Superfetch)\n • In the same Services window, locate SysMain.\n • Right-click > Properties > Set Startup type to Disabled > Click Stop.\n 3. Modify Indexing Options\n • Go to Control Panel > Indexing Options.\n • Click Modify > Uncheck folders that don’t need indexing.\n 4. Monitor System Performance\n • Use Task Manager to observe disk usage.\n • Reboot and test responsiveness.\n 5. Optional Hardware Upgrade\n • Upgrade to SSD for better disk I/O performance.\n • Increase RAM to reduce reliance on disk caching.\n Additional Notes:\n • Disabling these services may slightly impact search and app launch speed but improves overall system responsiveness.\n • Re-enable services if needed for specific use cases.\n'
      ]
    },

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
    // {
    //   id: 202,
    //   title: 'Apache Web Server Configuration',
    //   description: 'Setting up and configuring Apache web server on Linux',
    //   category: 'Web Server',
    //   priority: 'Medium',
    //   lastUpdated: '2023-11-30',
    //   author: 'Lisa Wang',
    //   tags: ['linux', 'apache', 'web-server'],
    //   steps: [
    //     'Install Apache: sudo apt install apache2',
    //     'Start and enable Apache service',
    //     'Configure virtual hosts in /etc/apache2/sites-available/',
    //     'Enable SSL/TLS with Let\'s Encrypt',
    //     'Configure security headers and modules',
    //     'Set up log rotation and monitoring'
    //   ]
    // }
  ],
  // 3: [ // Network
  //   {
  //     id: 301,
  //     title: 'VLAN Configuration on Cisco Switches',
  //     description: 'Step-by-step guide for configuring VLANs on Cisco switches',
  //     category: 'Switching',
  //     priority: 'Medium',
  //     lastUpdated: '2023-11-29',
  //     author: 'Robert Kim',
  //     tags: ['network', 'cisco', 'vlan'],
  //     steps: [
  //       'Connect to switch via console or SSH',
  //       'Enter global configuration mode',
  //       'Create VLAN: vlan [vlan-id]',
  //       'Assign name to VLAN: name [vlan-name]',
  //       'Configure access ports: switchport mode access',
  //       'Assign ports to VLAN: switchport access vlan [vlan-id]'
  //     ]
  //   },
  //   {
  //     id: 302,
  //     title: 'Firewall Rule Configuration',
  //     description: 'Configuring firewall rules for network security',
  //     category: 'Security',
  //     priority: 'High',
  //     lastUpdated: '2023-12-01',
  //     author: 'Emily Taylor',
  //     tags: ['network', 'firewall', 'security'],
  //     steps: [
  //       'Access firewall management interface',
  //       'Define network objects and groups',
  //       'Create security policies with appropriate rules',
  //       'Configure NAT policies if required',
  //       'Test firewall rules with traffic simulation',
  //       'Monitor logs and adjust rules as needed'
  //     ]
  //   }
  // ],
  3: [
    {
      id: 'autogen_1',
      title: 'Using AutoGen for Agentic Frameworks',
      content: `Using AutoGen for Agentic Frameworks
  
  AutoGen is a powerful tool for building agentic frameworks where multiple AI agents collaborate to solve complex tasks. It allows defining agents with specific roles, memory, and communication protocols. Agents can be chained or operate in parallel, enabling dynamic workflows. AutoGen supports both synchronous and asynchronous interactions. While it simplifies orchestration, it may require careful prompt engineering and resource management. Some teams find it hard to debug multi-agent flows. Despite that, AutoGen makes it easier to prototype intelligent systems with modular logic and reusable components.
  
  Note: Proper error handling and logging is crucial for stability.`,
      author: 'Lisa Park',
      dateCreated: '2024-02-01',
      views: 178,
      rating: 4.0,
      tags: ['Agentic', 'Framewords', 'Autogen'],
      priority: 'High',
      steps : [`Using AutoGen for Agentic Frameworks
  
  AutoGen is a powerful tool for building agentic frameworks where multiple AI agents collaborate to solve complex tasks. It allows defining agents with specific roles, memory, and communication protocols. Agents can be chained or operate in parallel, enabling dynamic workflows. AutoGen supports both synchronous and asynchronous interactions. While it simplifies orchestration, it may require careful prompt engineering and resource management. Some teams find it hard to debug multi-agent flows. Despite that, AutoGen makes it easier to prototype intelligent systems with modular logic and reusable components.
  
  Note: Proper error handling and logging is crucial for stability.`]
    },
    {
      id: 'langgraph_1',
      title: 'Using LangGraph for Agentic Frameworks',
      content: `Using LangGraph for Agentic Frameworks
  
  LangGraph helps in building agentic systems where agents can interact in a graph-based workflows. It supports both sync and async executions, but sometimes async flows are hard to debug. Agents can be defined with roles and memory, but memory management is not always stable. LangGraph makes it easy to create modular agents, but some users find it too complex for simple tasks. It also allows chaining agents, but chaining too many agents may slow down the system. Overall, LangGraph is a good tool for building smart agentic apps, but requiers careful design and testing.`,
      author: 'David Kumar',
      dateCreated: '2024-02-03',
      views: 156,
      rating: 3.7, 
      tags: ['LangGraph', 'Framewords'],
      priority: 'High',
      steps : [`Using LangGraph for Agentic Frameworks
  
  LangGraph helps in building agentic systems where agents can interact in a graph-based workflows. It supports both sync and async executions, but sometimes async flows are hard to debug. Agents can be defined with roles and memory, but memory management is not always stable. LangGraph makes it easy to create modular agents, but some users find it too complex for simple tasks. It also allows chaining agents, but chaining too many agents may slow down the system. Overall, LangGraph is a good tool for building smart agentic apps, but requiers careful design and testing.`]
    },
    {
      id: 'llm_training_1',
      title: 'Steps Involved in Training a Large Language Model (LLM)',
      tags: ['Traning', 'LLM'],
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
      author: 'Dr. Emily Watson',
      dateCreated: '2024-01-25',
      views: 298,
      rating: 4.5, 
      priority: 'High',
      step : [`Steps Involved in Training a Large Language Model (LLM)
  
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
  Package the model for inference. Optimize for latency and scalability. Monitor usage and update periodically.`]
    },
    {
      id: 'llm_training_2',
      title: 'Training Steps for Large Language Models (LLMs)',
      tags: ['Traning', 'LLM'],
      priority: 'High',
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
      author: 'Michael Zhang',
      dateCreated: '2024-01-28',
      views: 267,
      rating: 4.1, 
      steps : [`Training Steps for Large Language Models (LLMs)
  
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
  Deploy model for inference. Optimize for latency, but sometimes accuracy gets compromised. Monitor usage and retrain if needed.`]
    }
  ],
  4: [ // Database
    {
      id: 402,
      title: 'Comprehensive Guide to Resolving SQL Server Performance Issues Due to Missing Indexes and Inefficient Queries',
      description: 'Comprehensive Guide to Resolving SQL Server Performance Issues Due to Missing Indexes and Inefficient Queries',
      category: 'Performance',
      priority: 'Medium',
      lastUpdated: '2023-11-27',
      author: 'Maria Garcia',
      tags: ['database', 'postgresql', 'performance'],
      steps: [
        'Issue Summary:\n SQL Server performance can degrade due to two closely related issues: missing indexes and inefficient query design. These problems often coexist and compound each other, leading to slow response times and high resource consumption.\n Symptoms:\n • Slow query execution.\n • High CPU and memory usage.\n • Application timeouts or deadlocks.\n • Full table scans in execution plans.\n Root Causes:\n • Lack of indexes on frequently accessed columns.\n • Poor query structure (e.g., unnecessary joins, SELECT *, lack of filtering).\n • Inefficient use of SQL Server’s query optimizer.\n Unified Resolution Steps:\n 1. Identify Missing Indexes\n • Run:\n • SELECT * FROM sys.dm_db_missing_index_details;\n • Review recommendations and usage stats.\n 2. Analyze Query Execution Plans\n • Use SSMS to view graphical execution plans.\n • Look for table scans, key lookups, and expensive joins.\n 3. Create and Tune Indexes\n • Add non-clustered indexes on columns used in WHERE, JOIN, and ORDER BY clauses.\n • Avoid over-indexing to prevent write performance degradation.\n 4. Refactor Inefficient Queries\n • Replace SELECT * with specific columns.\n • Use indexed columns in filters.\n • Avoid nested subqueries when joins suffice.\n 5. Apply Query Hints (Advanced)\n • Use hints like OPTION (RECOMPILE) or FORCESEEK where appropriate.\n 6. Monitor and Benchmark\n • Use SQL Profiler, Extended Events, or Query Store to track performance improvements.\n Additional Notes:\n • Always test changes in a staging environment before applying to production.\n • Regularly review query performance and indexing strategy as data grows.\n'
      ]
    }
  ],
  6: [{
    id: 'kb_article_1',
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
    author: 'John Smith',
    dateCreated: '2024-01-10',
    views: 245,
    rating: 4.2,
    category: 'Windows Administration',
    author: 'System (Auto-merged)',
    dateCreated: '2024-01-20',
    priority: 'High',
    lastUpdated: '2023-12-01',
    tags: ['windows', 'server', 'installation'],
    views: 434,
    rating: '4.2',
    mergedFrom: 2,
    mergedDate: '2024-01-20',
    steps: ['Cloud Native Architecture Patterns\n Designed to help organizations build scalable, resilient, and cost-effective applications\n Monolithic Architecture\n Still valid for small teams and fast deployment cycles.\n Easier to debug and manage in early stages.\n Microservices can be overkill for simple applications.\n API Gateway Alternatives\n Instead of complex routing, use single endpoint with internal logic.\n Hostname and path routing can be confusing for new developers.\n HTTP header routing often leads to unexpected behavior.\n Resilience Tradeoffs\n Circuit breaker patterns may add latency.\n Retry with back-off can overload systems if not tuned properly.\n Saga orchestration is hard to maintain and debug.\n Data Handling Patterns\n Event sourcing is not always needed; simple CRUD may suffice.\n Transactional out-box adds infra complexity.\n Publish-subscribe can lead to message loss if not monitored.\n Transformation Approaches\n Strangler fig pattern may slow down migration.\n Anti-corruption layer adds extra abstraction that may not be needed.\n Integration Simplicity\n Scatter-gather is resource intensive.\n Hexagonal architecture is too abstract for many teams.\n']
  },
  {
    id: 'kb_article_2',
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
    author: 'Sarah Johnson',
    dateCreated: '2024-01-15',
    views: 189,
    rating: 4.0,
    category: 'Windows Administration',
    author: 'System (Auto-merged)',
    dateCreated: '2024-01-20',
    priority: 'High',
    lastUpdated: '2023-12-01',
    tags: ['windows', 'server', 'installation'],
    views: 434,
    rating: '4.2',
    mergedFrom: 2,
    mergedDate: '2024-01-20',
    steps: ['Cloud Native Architecture Patterns\n Designed to help organizations build scalable, resilient, and cost-effective applications\n Monolithic Architecture\n Still valid for small teams and fast deployment cycles.\n Easier to debug and manage in early stages.\n Microservices can be overkill for simple applications.\n API Gateway Alternatives\n Instead of complex routing, use single endpoint with internal logic.\n Hostname and path routing can be confusing for new developers.\n HTTP header routing often leads to unexpected behavior.\n Resilience Tradeoffs\n Circuit breaker patterns may add latency.\n Retry with back-off can overload systems if not tuned properly.\n Saga orchestration is hard to maintain and debug.\n Data Handling Patterns\n Event sourcing is not always needed; simple CRUD may suffice.\n Transactional out-box adds infra complexity.\n Publish-subscribe can lead to message loss if not monitored.\n Transformation Approaches\n Strangler fig pattern may slow down migration.\n Anti-corruption layer adds extra abstraction that may not be needed.\n Integration Simplicity\n Scatter-gather is resource intensive.\n Hexagonal architecture is too abstract for many teams.\n']
  },
  {
    id: 'databricks_1',
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
    author: 'Alex Chen',
    dateCreated: '2024-01-20',
    views: 156,
    rating: 3.8,
    category: 'Windows Administration',
    author: 'System (Auto-merged)',
    dateCreated: '2024-01-20',
    priority: 'High',
    lastUpdated: '2023-12-01',
    tags: ['windows', 'server', 'installation'],
    views: 434,
    rating: '4.2',
    mergedFrom: 2,
    mergedDate: '2024-01-20',
    steps: ['Databricks Parallel Processing Setup\n Purpose\n Guide to enable parallel processing in Databricks for faster data workloads.\n Scope\n For data engineers and infra teams using Spark on Databricks.\n Steps\n 1. Create a cluster with multiple workers. Avoid single-node clusters.\n 2. Set configs:\n spark.conf.set("spark.default.parallelism", "150")\n spark.conf.set("spark.sql.shuffle.partitions", "150")\n 3. Use DataFrame APIs instead of loops. Avoid collect() on big data.\n 4. Monitor jobs in Spark UI. Repartition if tasks are uneven.\n Tips\n - Auto-scaling helps but sometimes not reliable.\n - Caching is good but can cause memory issues.\n - Too many partitions slow down small jobs.\n Troubleshooting\n - Job slow? Check cluster size.\n - Memory errors? Reduce partitions.\n - Skewed data? Try salting.\n Note\n Hexagonal architecture is useful, but many teams find it too complex.\n Strangler fig pattern helps migration, but it can delay releases.\n']
  },
  {
    id: 'databricks_2',
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
    author: 'Maria Rodriguez',
    dateCreated: '2024-01-22',
    views: 142,
    rating: 3.6,
    category: 'Windows Administration',
    author: 'System (Auto-merged)',
    dateCreated: '2024-01-20',
    priority: 'High',
    lastUpdated: '2023-12-01',
    tags: ['windows', 'server', 'installation'],
    views: 434,
    rating: '4.2',
    mergedFrom: 2,
    mergedDate: '2024-01-20',
    steps: [
      'Databricks Setup for Parallel Workloads\n Purpose\n This article helps teams setup Databricks for running multiple tasks in parallel to improve speed and efficiency.\n Scope\n Useful for data teams, developers and infra admins working with Spark jobs.\n Steps\n 1. Create cluster with enough nodes. Single node clusters are sometimes okay for testing but not for production.\n 2. Configure spark settings:\n spark.conf.set("spark.sql.shuffle.partitions", "80")\n spark.conf.set("spark.default.parallelism", "80")\n 3. Use DataFrame operations. Avoid using pandas for big data.\n 4. Monitor Spark UI. If tasks are slow, repartition the data.\n Tips\n - Auto-scaling is good but can cause instability in some cases.\n - Caching helps performance but may lead to memory errors.\n - Using too many partitions is not always bad, depends on data size.\n Troubleshooting\n - Job fails? Check cluster logs.\n - Memory issues? Reduce partition count or increase node size.\n - Skewed data? Try using salting or bucketing.\n Note\n Hexagonal architecture is simple but not always practical.\n Strangler fig pattern is useful but can be hard to implement correctly.\n'
    ]

  }],
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




// [
//   {
//     id: 'autogen_1',
//     title: 'Using AutoGen for Agentic Frameworks',
//     content: `Using AutoGen for Agentic Frameworks

// AutoGen is a powerful tool for building agentic frameworks where multiple AI agents collaborate to solve complex tasks. It allows defining agents with specific roles, memory, and communication protocols. Agents can be chained or operate in parallel, enabling dynamic workflows. AutoGen supports both synchronous and asynchronous interactions. While it simplifies orchestration, it may require careful prompt engineering and resource management. Some teams find it hard to debug multi-agent flows. Despite that, AutoGen makes it easier to prototype intelligent systems with modular logic and reusable components.

// Note: Proper error handling and logging is crucial for stability.`,
//     author: 'Lisa Park',
//     dateCreated: '2024-02-01',
//     views: 178,
//     rating: 4.0,
//     priority: 'High',
//     steps : [`Using AutoGen for Agentic Frameworks

// AutoGen is a powerful tool for building agentic frameworks where multiple AI agents collaborate to solve complex tasks. It allows defining agents with specific roles, memory, and communication protocols. Agents can be chained or operate in parallel, enabling dynamic workflows. AutoGen supports both synchronous and asynchronous interactions. While it simplifies orchestration, it may require careful prompt engineering and resource management. Some teams find it hard to debug multi-agent flows. Despite that, AutoGen makes it easier to prototype intelligent systems with modular logic and reusable components.

// Note: Proper error handling and logging is crucial for stability.`]
//   },
//   {
//     id: 'langgraph_1',
//     title: 'Using LangGraph for Agentic Frameworks',
//     content: `Using LangGraph for Agentic Frameworks

// LangGraph helps in building agentic systems where agents can interact in a graph-based workflows. It supports both sync and async executions, but sometimes async flows are hard to debug. Agents can be defined with roles and memory, but memory management is not always stable. LangGraph makes it easy to create modular agents, but some users find it too complex for simple tasks. It also allows chaining agents, but chaining too many agents may slow down the system. Overall, LangGraph is a good tool for building smart agentic apps, but requiers careful design and testing.`,
//     author: 'David Kumar',
//     dateCreated: '2024-02-03',
//     views: 156,
//     rating: 3.7, 
//     priority: 'High',
//     steps : [`Using LangGraph for Agentic Frameworks

// LangGraph helps in building agentic systems where agents can interact in a graph-based workflows. It supports both sync and async executions, but sometimes async flows are hard to debug. Agents can be defined with roles and memory, but memory management is not always stable. LangGraph makes it easy to create modular agents, but some users find it too complex for simple tasks. It also allows chaining agents, but chaining too many agents may slow down the system. Overall, LangGraph is a good tool for building smart agentic apps, but requiers careful design and testing.`]
//   },
//   {
//     id: 'llm_training_1',
//     title: 'Steps Involved in Training a Large Language Model (LLM)',
//     content: `Steps Involved in Training a Large Language Model (LLM)

// 1. Data Collection
// Gather large-scale text data from diverse sources like books, websites, forums, and code repositories. Ensure data quality and remove harmful or biased content.

// 2. Data Preprocessing
// Clean and tokenize the data. Normalize text, remove duplicates, and format it for efficient training. Apply filtering to exclude irrelevant or noisy samples.

// 3. Model Architecture Design
// Choose or customize a neural network architecture (e.g., Transformer). Define number of layers, attention heads, and embedding dimensions.

// 4. Training
// Use distributed computing across GPUs/TPUs. Train the model using techniques like masked language modeling or causal language modeling. Monitor loss and adjust hyperparameters.

// 5. Evaluation & Fine-tuning
// Evaluate model performance on benchmark datasets. Fine-tune on domain-specific data if needed. Apply safety filters and alignment techniques.

// 6. Deployment
// Package the model for inference. Optimize for latency and scalability. Monitor usage and update periodically.`,
//     author: 'Dr. Emily Watson',
//     dateCreated: '2024-01-25',
//     views: 298,
//     rating: 4.5, 
//     priority: 'High',
//     step : [`Steps Involved in Training a Large Language Model (LLM)

// 1. Data Collection
// Gather large-scale text data from diverse sources like books, websites, forums, and code repositories. Ensure data quality and remove harmful or biased content.

// 2. Data Preprocessing
// Clean and tokenize the data. Normalize text, remove duplicates, and format it for efficient training. Apply filtering to exclude irrelevant or noisy samples.

// 3. Model Architecture Design
// Choose or customize a neural network architecture (e.g., Transformer). Define number of layers, attention heads, and embedding dimensions.

// 4. Training
// Use distributed computing across GPUs/TPUs. Train the model using techniques like masked language modeling or causal language modeling. Monitor loss and adjust hyperparameters.

// 5. Evaluation & Fine-tuning
// Evaluate model performance on benchmark datasets. Fine-tune on domain-specific data if needed. Apply safety filters and alignment techniques.

// 6. Deployment
// Package the model for inference. Optimize for latency and scalability. Monitor usage and update periodically.`]
//   },
//   {
//     id: 'llm_training_2',
//     title: 'Training Steps for Large Language Models (LLMs)',
//     priority: 'High',
//     content: `Training Steps for Large Language Models (LLMs)

// 1. Data Collection
// Collecting huge amount of text data from books, websites, and forums. Some teams uses social media data too, but it can be noisy and biased.

// 2. Preprocessing
// Clean the data by removing junk and tokenize it. Sometimes, filtering too much data leads to loss of context. Normalisation is important but not always needed.

// 3. Model Design
// Choose Transformer-based architecture. More layers means better performance, but also more compute cost. Some teams prefer smaller models for faster training.

// 4. Training
// Train using GPUs or TPUs. Distributed training is good but can be complex to setup. Use techniques like masked language modeling or sometimes causal modeling depending on usecase.

// 5. Evaluation & Fine-tunning
// Evaluate using benchmark datasets. Fine-tunning helps improve accuracy but may reduce generalisation. Safety filters are added but not always effective.

// 6. Deployment
// Deploy model for inference. Optimize for latency, but sometimes accuracy gets compromised. Monitor usage and retrain if needed.`,
//     author: 'Michael Zhang',
//     dateCreated: '2024-01-28',
//     views: 267,
//     rating: 4.1, 
//     steps : [`Training Steps for Large Language Models (LLMs)

// 1. Data Collection
// Collecting huge amount of text data from books, websites, and forums. Some teams uses social media data too, but it can be noisy and biased.

// 2. Preprocessing
// Clean the data by removing junk and tokenize it. Sometimes, filtering too much data leads to loss of context. Normalisation is important but not always needed.

// 3. Model Design
// Choose Transformer-based architecture. More layers means better performance, but also more compute cost. Some teams prefer smaller models for faster training.

// 4. Training
// Train using GPUs or TPUs. Distributed training is good but can be complex to setup. Use techniques like masked language modeling or sometimes causal modeling depending on usecase.

// 5. Evaluation & Fine-tunning
// Evaluate using benchmark datasets. Fine-tunning helps improve accuracy but may reduce generalisation. Safety filters are added but not always effective.

// 6. Deployment
// Deploy model for inference. Optimize for latency, but sometimes accuracy gets compromised. Monitor usage and retrain if needed.`]
//   }
// ]