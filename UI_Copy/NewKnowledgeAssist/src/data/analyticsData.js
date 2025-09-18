// SOP Analytics Data for D3.js Visualizations

// SOP Success Rate Data
export const sopSuccessData = [
  { status: 'Completed Successfully', count: 156, percentage: 62.4, color: '#28a745' },
  { status: 'In Progress', count: 43, percentage: 17.2, color: '#ffc107' },
  { status: 'Failed', count: 28, percentage: 11.2, color: '#dc3545' },
  { status: 'Incomplete', count: 23, percentage: 9.2, color: '#6c757d' }
];

// Monthly SOP Completion Trends
export const monthlyTrendsData = [
  { month: 'Jan', completed: 45, failed: 8, incomplete: 5 },
  { month: 'Feb', completed: 52, failed: 6, incomplete: 4 },
  { month: 'Mar', completed: 48, failed: 9, incomplete: 7 },
  { month: 'Apr', completed: 61, failed: 5, incomplete: 3 },
  { month: 'May', completed: 58, failed: 7, incomplete: 6 },
  { month: 'Jun', completed: 67, failed: 4, incomplete: 2 },
  { month: 'Jul', completed: 72, failed: 3, incomplete: 4 },
  { month: 'Aug', completed: 69, failed: 5, incomplete: 3 },
  { month: 'Sep', completed: 74, failed: 2, incomplete: 2 },
  { month: 'Oct', completed: 78, failed: 4, incomplete: 3 },
  { month: 'Nov', completed: 82, failed: 3, incomplete: 1 },
  { month: 'Dec', completed: 85, failed: 2, incomplete: 2 }
];

// Category-wise SOP Performance
export const categoryPerformanceData = [
  { category: 'Windows', total: 45, completed: 38, failed: 4, incomplete: 3, duplicates: 2, successRate: 84.4 },
  { category: 'Linux', total: 38, completed: 32, failed: 3, incomplete: 2, duplicates: 1, successRate: 84.2 },
  { category: 'Network', total: 42, completed: 35, failed: 4, incomplete: 2, duplicates: 1, successRate: 83.3 },
  { category: 'Database', total: 35, completed: 28, failed: 5, incomplete: 1, duplicates: 1, successRate: 80.0 },
  { category: 'Services', total: 28, completed: 22, failed: 3, incomplete: 2, duplicates: 1, successRate: 78.6 },
  { category: 'AWS', total: 32, completed: 26, failed: 4, incomplete: 1, duplicates: 1, successRate: 81.3 },
  { category: 'Azure', total: 30, completed: 25, failed: 2, incomplete: 2, duplicates: 1, successRate: 83.3 }
];

// SOP Priority Distribution
export const priorityDistributionData = [
  { priority: 'High', count: 85, color: '#dc3545', completionRate: 92.9 },
  { priority: 'Medium', count: 120, color: '#ffc107', completionRate: 87.5 },
  { priority: 'Low', count: 45, color: '#28a745', completionRate: 82.2 }
];

// Team Performance Data
export const teamPerformanceData = [
  { team: 'IT Infrastructure', completed: 45, average_time: 2.3, efficiency: 94.2 },
  { team: 'Database Admin', completed: 38, average_time: 3.1, efficiency: 89.5 },
  { team: 'Network Security', completed: 42, average_time: 2.8, efficiency: 91.3 },
  { team: 'Cloud Operations', completed: 35, average_time: 2.5, efficiency: 88.7 },
  { team: 'DevOps', completed: 52, average_time: 1.9, efficiency: 96.1 }
];

// SOP Execution Time Analysis
export const executionTimeData = [
  { timeRange: '< 30 min', count: 92, percentage: 36.8, color: '#28a745' },
  { timeRange: '30-60 min', count: 78, percentage: 31.2, color: '#17a2b8' },
  { timeRange: '1-2 hours', count: 45, percentage: 18.0, color: '#ffc107' },
  { timeRange: '2-4 hours', count: 25, percentage: 10.0, color: '#fd7e14' },
  { timeRange: '> 4 hours', count: 10, percentage: 4.0, color: '#dc3545' }
];

// SOP Error Analysis
export const errorAnalysisData = [
  { errorType: 'Configuration Error', count: 15, impact: 'High', color: '#dc3545' },
  { errorType: 'Network Timeout', count: 12, impact: 'Medium', color: '#ffc107' },
  { errorType: 'Permission Denied', count: 8, impact: 'Medium', color: '#ffc107' },
  { errorType: 'Service Unavailable', count: 6, impact: 'High', color: '#dc3545' },
  { errorType: 'Database Connection', count: 5, impact: 'High', color: '#dc3545' },
  { errorType: 'Invalid Input', count: 4, impact: 'Low', color: '#28a745' },
  { errorType: 'Resource Exhausted', count: 3, impact: 'Medium', color: '#ffc107' }
];

// Daily Activity Heatmap Data
export const activityHeatmapData = (() => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  days.forEach((day, dayIndex) => {
    hours.forEach(hour => {
      // Simulate realistic work patterns
      let activity = 0;
      if (dayIndex < 5) { // Weekdays
        if (hour >= 8 && hour <= 18) {
          activity = Math.floor(Math.random() * 15) + 5; // 5-20 activities
        } else if (hour >= 19 && hour <= 22) {
          activity = Math.floor(Math.random() * 8) + 1; // 1-8 activities
        } else {
          activity = Math.floor(Math.random() * 3); // 0-2 activities
        }
      } else { // Weekends
        if (hour >= 10 && hour <= 16) {
          activity = Math.floor(Math.random() * 5) + 1; // 1-5 activities
        } else {
          activity = Math.floor(Math.random() * 2); // 0-1 activities
        }
      }
      
      data.push({
        day,
        hour,
        activity,
        dayIndex,
        tooltip: `${day} ${hour}:00 - ${activity} SOPs executed`
      });
    });
  });
  
  return data;
})();

// Success Rate Improvement Over Time
export const improvementTrendData = [
  { quarter: 'Q1 2023', successRate: 75.2, target: 80.0 },
  { quarter: 'Q2 2023', successRate: 78.5, target: 82.0 },
  { quarter: 'Q3 2023', successRate: 82.1, target: 84.0 },
  { quarter: 'Q4 2023', successRate: 85.7, target: 86.0 },
  { quarter: 'Q1 2024', successRate: 88.3, target: 88.0 },
  { quarter: 'Q2 2024', successRate: 91.2, target: 90.0 }
];

// SOP Funnel Data (Conversion Analysis)
export const sopFunnelData = [
  { stage: 'SOPs Created', count: 320, percentage: 100, color: '#667eea' },
  { stage: 'Under Review', count: 285, percentage: 89.1, color: '#764ba2' },
  { stage: 'Approved', count: 260, percentage: 81.3, color: '#f093fb' },
  { stage: 'In Execution', count: 235, percentage: 73.4, color: '#4facfe' },
  { stage: 'Completed', count: 195, percentage: 60.9, color: '#43e97b' }
];

// SOP Category Treemap Data
export const sopTreemapData = [
  {
    name: 'IT Operations',
    children: [
      { name: 'Windows', value: 45, color: '#667eea' },
      { name: 'Linux', value: 38, color: '#764ba2' },
      { name: 'Network', value: 42, color: '#f093fb' },
      { name: 'Security', value: 35, color: '#4facfe' }
    ]
  },
  {
    name: 'Cloud Services',
    children: [
      { name: 'AWS', value: 32, color: '#43e97b' },
      { name: 'Azure', value: 30, color: '#fa709a' },
      { name: 'GCP', value: 18, color: '#fee140' },
      { name: 'Hybrid', value: 25, color: '#48cae4' }
    ]
  },
  {
    name: 'Database',
    children: [
      { name: 'MySQL', value: 22, color: '#f72585' },
      { name: 'PostgreSQL', value: 18, color: '#b5179e' },
      { name: 'MongoDB', value: 15, color: '#7209b7' },
      { name: 'Oracle', value: 12, color: '#480ca8' }
    ]
  }
];

// Performance Gauge Data
export const performanceGaugeData = [
  { 
    label: 'Overall Success Rate',
    value: 89.6,
    min: 0,
    max: 100,
    target: 90,
    color: '#28a745',
    unit: '%'
  },
  {
    label: 'Team Efficiency',
    value: 92.3,
    min: 0,
    max: 100,
    target: 85,
    color: '#007bff',
    unit: '%'
  },
  {
    label: 'Response Time',
    value: 2.4,
    min: 0,
    max: 5,
    target: 3.0,
    color: '#ffc107',
    unit: 'hrs'
  }
];

// SOP Flow/Sankey Data
export const sopFlowData = {
  nodes: [
    { id: 'Created', group: 1 },
    { id: 'Windows', group: 2 },
    { id: 'Linux', group: 2 },
    { id: 'Network', group: 2 },
    { id: 'Database', group: 2 },
    { id: 'Success', group: 3 },
    { id: 'Failed', group: 3 },
    { id: 'In Progress', group: 3 }
  ],
  links: [
    { source: 'Created', target: 'Windows', value: 45 },
    { source: 'Created', target: 'Linux', value: 38 },
    { source: 'Created', target: 'Network', value: 42 },
    { source: 'Created', target: 'Database', value: 35 },
    { source: 'Windows', target: 'Success', value: 38 },
    { source: 'Windows', target: 'Failed', value: 4 },
    { source: 'Windows', target: 'In Progress', value: 3 },
    { source: 'Linux', target: 'Success', value: 32 },
    { source: 'Linux', target: 'Failed', value: 3 },
    { source: 'Linux', target: 'In Progress', value: 3 },
    { source: 'Network', target: 'Success', value: 35 },
    { source: 'Network', target: 'Failed', value: 4 },
    { source: 'Network', target: 'In Progress', value: 3 },
    { source: 'Database', target: 'Success', value: 28 },
    { source: 'Database', target: 'Failed', value: 5 },
    { source: 'Database', target: 'In Progress', value: 2 }
  ]
};

// Parallel Coordinates Data
export const parallelCoordsData = [
  { name: 'Windows Team', complexity: 7, time: 2.1, success: 94, efficiency: 92 },
  { name: 'Linux Team', complexity: 8, time: 2.8, success: 89, efficiency: 88 },
  { name: 'Network Team', complexity: 9, time: 3.2, success: 91, efficiency: 85 },
  { name: 'Database Team', complexity: 6, time: 2.5, success: 87, efficiency: 90 },
  { name: 'Cloud Team', complexity: 8, time: 2.0, success: 95, efficiency: 96 },
  { name: 'Security Team', complexity: 9, time: 3.5, success: 88, efficiency: 84 }
];

// Waterfall Chart Data
export const waterfallData = [
  { category: 'Starting SOPs', value: 200, type: 'start' },
  { category: 'New Created', value: 50, type: 'positive' },
  { category: 'Completed', value: -45, type: 'negative' },
  { category: 'Failed', value: -8, type: 'negative' },
  { category: 'Duplicates Removed', value: -12, type: 'negative' },
  { category: 'In Review', value: 25, type: 'positive' },
  { category: 'Current Total', value: 210, type: 'end' }
];

// Violin Plot Data (Distribution Analysis)
export const violinPlotData = [
  {
    category: 'Windows',
    values: [1.2, 1.5, 1.8, 2.1, 2.3, 2.5, 2.8, 3.1, 3.4, 3.7, 2.9, 2.2, 1.9, 2.6, 3.2]
  },
  {
    category: 'Linux', 
    values: [2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.2, 3.8, 3.5, 3.2, 2.9, 2.6, 3.1, 3.7]
  },
  {
    category: 'Network',
    values: [1.8, 2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 3.2, 2.9, 2.6, 2.3, 2.8, 3.1, 2.5, 2.2]
  },
  {
    category: 'Database',
    values: [2.5, 2.8, 3.1, 3.4, 3.7, 4.0, 4.3, 3.9, 3.6, 3.3, 3.0, 2.7, 3.2, 3.8, 4.1]
  }
];

export const kpiMetrics = {
  totalSOPs: 250,
  completedSOPs: 156,
  averageExecutionTime: '2.4 hours',
  successRate: 89.6,
  duplicateSOPs: 8,
  criticalFailures: 5,
  teamEfficiency: 92.3,
  costSavings: '$45,200'
}; 