import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Badge, Dropdown, ProgressBar, Button, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  sopSuccessData,
  monthlyTrendsData,
  categoryPerformanceData,
  executionTimeData,
  errorAnalysisData,
  kpiMetrics,
  priorityDistributionData,
  teamPerformanceData,
  activityHeatmapData,
  improvementTrendData,
  sopFunnelData,
  sopTreemapData,
  performanceGaugeData,
  sopFlowData,
  parallelCoordsData,
  waterfallData,
  violinPlotData
} from '../../data/analyticsData';
import { IconButton, Tooltip } from '@mui/material';
import { 
  HiArrowLeft, 
  HiFunnel, 
  HiArrowTrendingUp, 
  HiArrowPath, 
  HiSignal,
  HiChartPie,
  HiChartBar,
  HiClock,
  HiDocument,
  HiCheckCircle,
  HiClipboardDocumentList,
  HiExclamationTriangle,
  HiTrophy,
  HiArrowDownTray,
  HiEye,
  HiMapPin,
  HiCircleStack,
  HiBarsArrowUp,
  HiBeaker,
  HiCubeTransparent,
  HiSparkles,
  HiChartBarSquare,
  HiPresentationChartLine,
  HiLightBulb
} from 'react-icons/hi2';

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 12 Months');
  const [selectedChartView, setSelectedChartView] = useState('overview');
  const [notification, setNotification] = useState('');

  // D3.js chart refs
  const sopSuccessRef = useRef();
  const monthlyTrendsRef = useRef();
  const categoryPerformanceRef = useRef();
  const executionTimeRef = useRef();
  const priorityDistributionRef = useRef();
  const teamPerformanceRef = useRef();
  const activityHeatmapRef = useRef();
  const improvementTrendRef = useRef();
  const radarChartRef = useRef();
  const bubbleChartRef = useRef();
  const funnelChartRef = useRef();
  const treemapRef = useRef();
  const gaugeChartRef = useRef();
  const sankeyChartRef = useRef();
  const parallelCoordsRef = useRef();
  const waterfallChartRef = useRef();
  const violinPlotRef = useRef();

  useEffect(() => {
    if (selectedChartView === 'overview') {
      createSOPSuccessChart();
      createMonthlyTrendsChart();
      createCategoryPerformanceChart();
      createExecutionTimeChart();
    } else if (selectedChartView === 'advanced') {
      createPriorityDistributionChart();
      createTeamPerformanceChart();
      createActivityHeatmap();
      createImprovementTrendChart();
    } else if (selectedChartView === 'interactive') {
      createRadarChart();
      createBubbleChart();
      createFunnelChart();
      createTreemap();
      createGaugeChart();
      createSankeyChart();
      createParallelCoords();
      createWaterfallChart();
      createViolinPlot();
    }
    
    // Always create extended analytics charts
    setTimeout(() => {
      createFunnelChart();
      createTreemap();
      createGaugeChart();
      createSankeyChart();
      createParallelCoords();
      createWaterfallChart();
      createViolinPlot();
    }, 100);
  }, [selectedChartView]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  // Create tooltip
  const createTooltip = () => {
    return d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.9)')
      .style('color', 'white')
      .style('padding', '12px 16px')
      .style('border-radius', '8px')
      .style('font-size', '13px')
      .style('font-weight', '500')
      .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);
  };

  // SOP Success Rate Donut Chart with Tooltips
  const createSOPSuccessChart = () => {
    const svg = d3.select(sopSuccessRef.current);
    svg.selectAll('*').remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 30;

    const svgElement = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const arcs = svgElement.selectAll('.arc')
      .data(pie(sopSuccessData))
      .enter().append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .style('opacity', 0.9)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .style('opacity', 1)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)');
        
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong style="font-size: 14px;">${d.data.status}</strong><br/>
            <span style="color: #ffd700;">Count:</span> ${d.data.count} SOPs<br/>
            <span style="color: #ffd700;">Percentage:</span> ${d.data.percentage}%<br/>
            <span style="color: #ffd700;">Total:</span> ${kpiMetrics.totalSOPs} SOPs
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        d3.select('.tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .style('opacity', 0.9)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
        
        d3.selectAll('.tooltip').remove();
      });

    // Center text
    svgElement.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .style('font-size', '32px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(`${kpiMetrics.successRate}%`);

    svgElement.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '14px')
      .style('fill', '#666')
      .text('Success Rate');
  };

  // Monthly Trends Line Chart with Area Fill
  const createMonthlyTrendsChart = () => {
    const svg = d3.select(monthlyTrendsRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(monthlyTrendsData.map(d => d.month))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(monthlyTrendsData, d => Math.max(d.completed, d.failed, d.incomplete)) + 10])
      .range([height, 0]);

    // Add grid lines
    svgElement.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .enter().append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666');

    svgElement.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', '#666');

    // Area generator for completed SOPs
    const area = d3.area()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y0(height)
      .y1(d => yScale(d.completed))
      .curve(d3.curveMonotoneX);

    // Add area chart
    svgElement.append('path')
      .datum(monthlyTrendsData)
      .attr('fill', 'url(#completedGradient)')
      .attr('d', area);

    // Define gradient
    const defs = svgElement.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'completedGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#28a745')
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#28a745')
      .attr('stop-opacity', 0.8);

    // Line generators
    const completedLine = d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.completed))
      .curve(d3.curveMonotoneX);

    const failedLine = d3.line()
      .x(d => xScale(d.month) + xScale.bandwidth() / 2)
      .y(d => yScale(d.failed))
      .curve(d3.curveMonotoneX);

    // Add lines
    svgElement.append('path')
      .datum(monthlyTrendsData)
      .attr('fill', 'none')
      .attr('stroke', '#28a745')
      .attr('stroke-width', 3)
      .attr('d', completedLine);

    svgElement.append('path')
      .datum(monthlyTrendsData)
      .attr('fill', 'none')
      .attr('stroke', '#dc3545')
      .attr('stroke-width', 3)
      .attr('d', failedLine);

    // Add completed dots with tooltips
    svgElement.selectAll('.completed-dot')
      .data(monthlyTrendsData)
      .enter().append('circle')
      .attr('class', 'completed-dot')
      .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.completed))
      .attr('r', 5)
      .attr('fill', '#28a745')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 8);
        
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong style="color: #28a745; font-size: 14px;">${d.month} - Completed SOPs</strong><br/>
            <span style="color: #ffd700;">Completed:</span> ${d.completed} SOPs<br/>
            <span style="color: #ffd700;">Failed:</span> ${d.failed} SOPs<br/>
            <span style="color: #ffd700;">Incomplete:</span> ${d.incomplete} SOPs<br/>
            <span style="color: #ffd700;">Success Rate:</span> ${((d.completed / (d.completed + d.failed + d.incomplete)) * 100).toFixed(1)}%
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        d3.select('.tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(200).attr('r', 5);
        d3.selectAll('.tooltip').remove();
      });

    // Add failed dots with tooltips
    svgElement.selectAll('.failed-dot')
      .data(monthlyTrendsData)
      .enter().append('circle')
      .attr('class', 'failed-dot')
      .attr('cx', d => xScale(d.month) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.failed))
      .attr('r', 5)
      .attr('fill', '#dc3545')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('r', 8);
        
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong style="color: #dc3545; font-size: 14px;">${d.month} - Failed SOPs</strong><br/>
            <span style="color: #ffd700;">Failed:</span> ${d.failed} SOPs<br/>
            <span style="color: #ffd700;">Completed:</span> ${d.completed} SOPs<br/>
            <span style="color: #ffd700;">Incomplete:</span> ${d.incomplete} SOPs<br/>
            <span style="color: #ffd700;">Failure Rate:</span> ${((d.failed / (d.completed + d.failed + d.incomplete)) * 100).toFixed(1)}%
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        d3.select('.tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).transition().duration(200).attr('r', 5);
        d3.selectAll('.tooltip').remove();
      });
  };

  // Category Performance 3D-like Bar Chart
  const createCategoryPerformanceChart = () => {
    const svg = d3.select(categoryPerformanceRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(categoryPerformanceData.map(d => d.category))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);

    // Add grid lines
    svgElement.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .enter().append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666')
      .selectAll('text')
      .style('font-size', '12px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svgElement.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => d + '%'))
      .style('color', '#666');

    // Create gradient for 3D effect
    const defs = svgElement.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'barGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#667eea');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#764ba2');

    // Add bars with 3D effect
    svgElement.selectAll('.bar')
      .data(categoryPerformanceData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.successRate))
      .attr('height', d => height - yScale(d.successRate))
      .attr('fill', 'url(#barGradient)')
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', 'drop-shadow(5px 5px 10px rgba(0,0,0,0.5))')
          .attr('transform', 'scale(1.05)');
        
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong style="color: #667eea; font-size: 14px;">${d.category} Category</strong><br/>
            <span style="color: #ffd700;">Success Rate:</span> ${d.successRate}%<br/>
            <span style="color: #ffd700;">Total SOPs:</span> ${d.total}<br/>
            <span style="color: #ffd700;">Completed:</span> ${d.completed}<br/>
            <span style="color: #ffd700;">Failed:</span> ${d.failed}<br/>
            <span style="color: #ffd700;">Incomplete:</span> ${d.incomplete}<br/>
            <span style="color: #ffd700;">Duplicates:</span> ${d.duplicates}
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', function(event) {
        d3.select('.tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .style('filter', 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))')
          .attr('transform', 'scale(1)');
        d3.selectAll('.tooltip').remove();
      });

    // Add value labels
    svgElement.selectAll('.label')
      .data(categoryPerformanceData)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.successRate) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text(d => d.successRate + '%');
  };

  // Execution Time Stacked Bar Chart
  const createExecutionTimeChart = () => {
    const svg = d3.select(executionTimeRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(executionTimeData.map(d => d.timeRange))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(executionTimeData, d => d.count) + 10])
      .range([height, 0]);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666')
      .selectAll('text')
      .style('font-size', '11px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svgElement.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', '#666');

    // Add bars with animation
    svgElement.selectAll('.bar')
      .data(executionTimeData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.timeRange))
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('y', d => yScale(d.count))
      .attr('height', d => height - yScale(d.count));

    // Add interactivity after animation
    setTimeout(() => {
      svgElement.selectAll('.bar')
        .on('mouseover', function(event, d) {
          d3.select(this).transition().duration(200).attr('transform', 'scale(1.05)');
          
          const tooltip = createTooltip();
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip.html(`
            <div style="text-align: center;">
              <strong style="font-size: 14px;">${d.timeRange} Execution Time</strong><br/>
              <span style="color: #ffd700;">Count:</span> ${d.count} SOPs<br/>
              <span style="color: #ffd700;">Percentage:</span> ${d.percentage}%<br/>
              <span style="color: #ffd700;">Total SOPs:</span> ${kpiMetrics.totalSOPs}<br/>
              <span style="color: #ffd700;">Avg. Time:</span> ${kpiMetrics.averageExecutionTime}
            </div>
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mousemove', function(event) {
          d3.select('.tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).transition().duration(200).attr('transform', 'scale(1)');
          d3.selectAll('.tooltip').remove();
        });
    }, 1500);

    // Add value labels
    setTimeout(() => {
      svgElement.selectAll('.label')
        .data(executionTimeData)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.timeRange) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.count) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .style('opacity', 0)
        .text(d => d.count)
        .transition()
        .duration(500)
        .style('opacity', 1);
    }, 1200);
  };

  // Priority Distribution Horizontal Bar Chart
  const createPriorityDistributionChart = () => {
    const svg = d3.select(priorityDistributionRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 80, bottom: 40, left: 80 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(priorityDistributionData, d => d.count) + 20])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(priorityDistributionData.map(d => d.priority))
      .range([0, height])
      .padding(0.2);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666');

    svgElement.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', '#666');

    // Add bars
    svgElement.selectAll('.bar')
      .data(priorityDistributionData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => yScale(d.priority))
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => d.color)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('width', d => xScale(d.count));

    // Add value labels
    setTimeout(() => {
      svgElement.selectAll('.label')
        .data(priorityDistributionData)
        .enter().append('text')
        .attr('class', 'label')
        .attr('x', d => xScale(d.count) + 5)
        .attr('y', d => yScale(d.priority) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(d => `${d.count} (${d.completionRate}%)`)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    }, 1000);
  };

  // Team Performance Radar Chart
  const createRadarChart = () => {
    const svg = d3.select(radarChartRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 350;
    const radius = Math.min(width, height) / 2 - 50;

    const svgElement = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const categories = ['Completed', 'Avg Time', 'Efficiency'];
    const maxValues = [60, 4, 100];
    const angleSlice = Math.PI * 2 / categories.length;

    // Create scales
    const rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, 100]);

    // Draw grid circles
    for (let i = 1; i <= 5; i++) {
      svgElement.append('circle')
        .attr('r', radius * i / 5)
        .attr('fill', 'none')
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 1);
    }

    // Draw axes
    categories.forEach((category, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      svgElement.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', radius * Math.cos(angle))
        .attr('y2', radius * Math.sin(angle))
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      // Add labels
      svgElement.append('text')
        .attr('x', (radius + 20) * Math.cos(angle))
        .attr('y', (radius + 20) * Math.sin(angle))
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(category);
    });

    // Draw team data
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    teamPerformanceData.forEach((team, teamIndex) => {
      const dataPoints = [
        { value: (team.completed / 60) * 100, max: 60 },
        { value: ((4 - team.average_time) / 4) * 100, max: 4 },
        { value: team.efficiency, max: 100 }
      ];

      const lineGenerator = d3.lineRadial()
        .angle((d, i) => angleSlice * i)
        .radius(d => rScale(d.value))
        .curve(d3.curveLinearClosed);

      const path = svgElement.append('path')
        .datum(dataPoints)
        .attr('d', lineGenerator)
        .attr('fill', colors[teamIndex])
        .attr('fill-opacity', 0.2)
        .attr('stroke', colors[teamIndex])
        .attr('stroke-width', 2)
        .style('cursor', 'pointer');

      // Add dots
      dataPoints.forEach((point, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        svgElement.append('circle')
          .attr('cx', rScale(point.value) * Math.cos(angle))
          .attr('cy', rScale(point.value) * Math.sin(angle))
          .attr('r', 4)
          .attr('fill', colors[teamIndex])
          .style('cursor', 'pointer');
      });
    });

    // Add legend
    const legend = svgElement.append('g')
      .attr('transform', `translate(${-width/2 + 20}, ${height/2 - 120})`);

    teamPerformanceData.forEach((team, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem.append('circle')
        .attr('r', 6)
        .attr('fill', colors[i]);

      legendItem.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .style('font-size', '11px')
        .style('fill', '#333')
        .text(team.team);
    });
  };

  // Bubble Chart for Team Efficiency vs Completed Tasks
  const createBubbleChart = () => {
    const svg = d3.select(bubbleChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 50, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(teamPerformanceData, d => d.completed) + 10])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([80, 100])
      .range([height, 0]);

    const radiusScale = d3.scaleSqrt()
      .domain([1, 4])
      .range([10, 30]);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666');

    svgElement.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', '#666');

    // Add axis labels
    svgElement.append('text')
      .attr('transform', `translate(${width / 2}, ${height + 40})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Completed SOPs');

    svgElement.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text('Efficiency (%)');

    // Add bubbles
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    
    svgElement.selectAll('.bubble')
      .data(teamPerformanceData)
      .enter().append('circle')
      .attr('class', 'bubble')
      .attr('cx', d => xScale(d.completed))
      .attr('cy', d => yScale(d.efficiency))
      .attr('r', 0)
      .attr('fill', (d, i) => colors[i])
      .attr('fill-opacity', 0.7)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('r', d => radiusScale(d.average_time));

    // Add labels
    setTimeout(() => {
      svgElement.selectAll('.bubble-label')
        .data(teamPerformanceData)
        .enter().append('text')
        .attr('class', 'bubble-label')
        .attr('x', d => xScale(d.completed))
        .attr('y', d => yScale(d.efficiency))
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('fill', '#fff')
        .style('opacity', 0)
        .text(d => d.team.split(' ')[0])
        .transition()
        .duration(500)
        .style('opacity', 1);
    }, 1500);
  };

  // Activity Heatmap
  const createActivityHeatmap = () => {
    const svg = d3.select(activityHeatmapRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 50, bottom: 50, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 200 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const xScale = d3.scaleBand()
      .domain(hours)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(days)
      .range([0, height])
      .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(activityHeatmapData, d => d.activity)]);

    // Add rectangles
    svgElement.selectAll('.heatmap-cell')
      .data(activityHeatmapData)
      .enter().append('rect')
      .attr('class', 'heatmap-cell')
      .attr('x', d => xScale(d.hour))
      .attr('y', d => yScale(d.day))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.activity))
      .attr('rx', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#333')
          .attr('stroke-width', 2);
        
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(d.tooltip)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', 'none');
        d3.selectAll('.tooltip').remove();
      });

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => d + ':00'))
      .style('color', '#666')
      .selectAll('text')
      .style('font-size', '10px');

    svgElement.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', '#666')
      .selectAll('text')
      .style('font-size', '12px');
  };

  // Improvement Trend Area Chart
  const createImprovementTrendChart = () => {
    const svg = d3.select(improvementTrendRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 50, bottom: 50, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 250 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(improvementTrendData.map(d => d.quarter))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([70, 95])
      .range([height, 0]);

    // Add grid lines
    svgElement.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .enter().append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666');

    svgElement.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => d + '%'))
      .style('color', '#666');

    // Create area generators
    const actualArea = d3.area()
      .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
      .y0(height)
      .y1(d => yScale(d.successRate))
      .curve(d3.curveMonotoneX);

    const targetLine = d3.line()
      .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
      .y(d => yScale(d.target))
      .curve(d3.curveMonotoneX);

    // Add gradient
    const defs = svgElement.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'improvementGradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', height)
      .attr('x2', 0).attr('y2', 0);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#667eea')
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#667eea')
      .attr('stop-opacity', 0.8);

    // Add area
    svgElement.append('path')
      .datum(improvementTrendData)
      .attr('fill', 'url(#improvementGradient)')
      .attr('d', actualArea);

    // Add target line
    svgElement.append('path')
      .datum(improvementTrendData)
      .attr('fill', 'none')
      .attr('stroke', '#dc3545')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5')
      .attr('d', targetLine);

    // Add actual line
    svgElement.append('path')
      .datum(improvementTrendData)
      .attr('fill', 'none')
      .attr('stroke', '#667eea')
      .attr('stroke-width', 3)
      .attr('d', d3.line()
        .x(d => xScale(d.quarter) + xScale.bandwidth() / 2)
        .y(d => yScale(d.successRate))
        .curve(d3.curveMonotoneX));

    // Add dots
    svgElement.selectAll('.actual-dot')
      .data(improvementTrendData)
      .enter().append('circle')
      .attr('class', 'actual-dot')
      .attr('cx', d => xScale(d.quarter) + xScale.bandwidth() / 2)
      .attr('cy', d => yScale(d.successRate))
      .attr('r', 5)
      .attr('fill', '#667eea')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add legend
    const legend = svgElement.append('g')
      .attr('transform', `translate(${width - 150}, 20)`);

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#667eea')
      .attr('stroke-width', 3);

    legend.append('text')
      .attr('x', 25)
      .attr('y', 5)
      .style('font-size', '12px')
      .style('fill', '#333')
      .text('Actual');

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 15)
      .attr('y2', 15)
      .attr('stroke', '#dc3545')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    legend.append('text')
      .attr('x', 25)
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', '#333')
      .text('Target');
  };

  // Team Performance Stacked Bar Chart
  const createTeamPerformanceChart = () => {
    const svg = d3.select(teamPerformanceRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 80, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(teamPerformanceData.map(d => d.team))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(teamPerformanceData, d => d.completed) + 10])
      .range([height, 0]);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([d3.min(teamPerformanceData, d => d.efficiency), d3.max(teamPerformanceData, d => d.efficiency)]);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .style('color', '#666')
      .selectAll('text')
      .style('font-size', '11px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svgElement.append('g')
      .call(d3.axisLeft(yScale))
      .style('color', '#666');

    // Add bars
    svgElement.selectAll('.team-bar')
      .data(teamPerformanceData)
      .enter().append('rect')
      .attr('class', 'team-bar')
      .attr('x', d => xScale(d.team))
      .attr('width', xScale.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', d => colorScale(d.efficiency))
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 200)
      .attr('y', d => yScale(d.completed))
      .attr('height', d => height - yScale(d.completed));

    // Add efficiency indicators on top of bars
    setTimeout(() => {
      svgElement.selectAll('.efficiency-circle')
        .data(teamPerformanceData)
        .enter().append('circle')
        .attr('class', 'efficiency-circle')
        .attr('cx', d => xScale(d.team) + xScale.bandwidth() / 2)
        .attr('cy', d => yScale(d.completed) - 15)
        .attr('r', 8)
        .attr('fill', '#fff')
        .attr('stroke', d => colorScale(d.efficiency))
        .attr('stroke-width', 3)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

      svgElement.selectAll('.efficiency-text')
        .data(teamPerformanceData)
        .enter().append('text')
        .attr('class', 'efficiency-text')
        .attr('x', d => xScale(d.team) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.completed) - 11)
        .attr('text-anchor', 'middle')
        .style('font-size', '9px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(d => d.efficiency.toFixed(0))
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay(300)
        .style('opacity', 1);
    }, 1200);
  };

  // Funnel Chart for SOP Conversion Analysis
  const createFunnelChart = () => {
    const svg = d3.select(funnelChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 50, bottom: 30, left: 100 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const maxWidth = width * 0.8;
    const stepHeight = height / sopFunnelData.length;

    sopFunnelData.forEach((step, i) => {
      const stepWidth = (step.percentage / 100) * maxWidth;
      const x = (maxWidth - stepWidth) / 2;
      const y = i * stepHeight;

      // Create funnel segment
      svgElement.append('rect')
        .attr('x', x)
        .attr('y', y + 5)
        .attr('width', stepWidth)
        .attr('height', stepHeight - 10)
        .attr('fill', step.color)
        .attr('fill-opacity', 0.8)
        .attr('rx', 5)
        .style('cursor', 'pointer')
        .on('mouseover', function(event) {
          d3.select(this).attr('fill-opacity', 1);
          const tooltip = createTooltip();
          tooltip.transition().duration(200).style('opacity', 1);
          tooltip.html(`
            <div style="text-align: center;">
              <strong>${step.stage}</strong><br/>
              Count: ${step.count}<br/>
              Percentage: ${step.percentage.toFixed(1)}%
            </div>
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill-opacity', 0.8);
          d3.selectAll('.tooltip').remove();
        });

      // Add labels
      svgElement.append('text')
        .attr('x', -10)
        .attr('y', y + stepHeight / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(step.stage);

      svgElement.append('text')
        .attr('x', x + stepWidth + 10)
        .attr('y', y + stepHeight / 2 - 5)
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .style('fill', step.color)
        .text(step.count);

      svgElement.append('text')
        .attr('x', x + stepWidth + 10)
        .attr('y', y + stepHeight / 2 + 10)
        .attr('dy', '0.35em')
        .style('font-size', '10px')
        .style('fill', '#666')
        .text(`${step.percentage.toFixed(1)}%`);
    });
  };

  // Treemap for SOP Categories
  const createTreemap = () => {
    const svg = d3.select(treemapRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;

    const svgElement = svg
      .attr('width', width)
      .attr('height', height);

    const root = d3.hierarchy({ children: sopTreemapData })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .padding(2)
      (root);

    const leaf = svgElement.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

    leaf.append('rect')
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => d.data.color)
      .attr('fill-opacity', 0.8)
      .attr('rx', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill-opacity', 1);
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong>${d.data.name}</strong><br/>
            Category: ${d.parent.data.name}<br/>
            SOPs: ${d.data.value}
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill-opacity', 0.8);
        d3.selectAll('.tooltip').remove();
      });

    leaf.append('text')
      .attr('x', 4)
      .attr('y', 15)
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .text(d => d.data.name);

    leaf.append('text')
      .attr('x', 4)
      .attr('y', 30)
      .style('font-size', '10px')
      .style('fill', 'white')
      .text(d => d.data.value);
  };

  // Performance Gauge Charts
  const createGaugeChart = () => {
    const svg = d3.select(gaugeChartRef.current);
    svg.selectAll('*').remove();

    const width = 600;
    const height = 200;
    const gaugeWidth = width / performanceGaugeData.length;

    performanceGaugeData.forEach((gauge, index) => {
      const centerX = (index * gaugeWidth) + (gaugeWidth / 2);
      const centerY = height - 30;
      const radius = Math.min(gaugeWidth, height) / 3;

      const svgElement = svg
        .attr('width', width)
        .attr('height', height);

      // Background arc
      const backgroundArc = d3.arc()
        .innerRadius(radius - 15)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(Math.PI / 2);

      svgElement.append('path')
        .attr('d', backgroundArc)
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .attr('fill', '#e0e0e0');

      // Value arc
      const angle = (gauge.value / gauge.max) * Math.PI - Math.PI / 2;
      const valueArc = d3.arc()
        .innerRadius(radius - 15)
        .outerRadius(radius)
        .startAngle(-Math.PI / 2)
        .endAngle(angle);

      svgElement.append('path')
        .attr('d', valueArc)
        .attr('transform', `translate(${centerX}, ${centerY})`)
        .attr('fill', gauge.color);

      // Target line
      const targetAngle = (gauge.target / gauge.max) * Math.PI - Math.PI / 2;
      svgElement.append('line')
        .attr('x1', centerX + (radius - 20) * Math.cos(targetAngle))
        .attr('y1', centerY + (radius - 20) * Math.sin(targetAngle))
        .attr('x2', centerX + (radius + 5) * Math.cos(targetAngle))
        .attr('y2', centerY + (radius + 5) * Math.sin(targetAngle))
        .attr('stroke', '#dc3545')
        .attr('stroke-width', 3);

      // Center value
      svgElement.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', gauge.color)
        .text(`${gauge.value}${gauge.unit}`);

      // Label
      svgElement.append('text')
        .attr('x', centerX)
        .attr('y', height - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', '#666')
        .text(gauge.label);
    });
  };

  // Waterfall Chart
  const createWaterfallChart = () => {
    const svg = d3.select(waterfallChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Calculate cumulative values
    let cumulative = 0;
    const processedData = waterfallData.map(d => {
      const start = cumulative;
      if (d.type === 'start' || d.type === 'end') {
        cumulative = d.value;
      } else {
        cumulative += d.value;
      }
      return {
        ...d,
        start: d.type === 'end' ? 0 : start,
        end: d.type === 'end' ? cumulative : cumulative,
        cumulative
      };
    });

    const xScale = d3.scaleBand()
      .domain(processedData.map(d => d.category))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(processedData, d => Math.max(d.end, d.start)) + 20])
      .range([height, 0]);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '10px')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svgElement.append('g')
      .call(d3.axisLeft(yScale));

    // Add bars
    svgElement.selectAll('.waterfall-bar')
      .data(processedData)
      .enter().append('rect')
      .attr('class', 'waterfall-bar')
      .attr('x', d => xScale(d.category))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(Math.max(d.start, d.end)))
      .attr('height', d => Math.abs(yScale(d.start) - yScale(d.end)))
      .attr('fill', d => {
        if (d.type === 'start' || d.type === 'end') return '#667eea';
        return d.type === 'positive' ? '#28a745' : '#dc3545';
      })
      .attr('fill-opacity', 0.8)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill-opacity', 1);
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong>${d.category}</strong><br/>
            Value: ${d.value > 0 ? '+' : ''}${d.value}<br/>
            Cumulative: ${d.cumulative}
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('fill-opacity', 0.8);
        d3.selectAll('.tooltip').remove();
      });

    // Add connecting lines
    for (let i = 0; i < processedData.length - 1; i++) {
      const current = processedData[i];
      const next = processedData[i + 1];
      
      if (current.type !== 'end' && next.type !== 'start') {
        svgElement.append('line')
          .attr('x1', xScale(current.category) + xScale.bandwidth())
          .attr('y1', yScale(current.cumulative))
          .attr('x2', xScale(next.category))
          .attr('y2', yScale(current.cumulative))
          .attr('stroke', '#999')
          .attr('stroke-dasharray', '3,3')
          .attr('stroke-width', 1);
             }
     }
   };

  // Sankey Chart for SOP Flow
  const createSankeyChart = () => {
    const svg = d3.select(sankeyChartRef.current);
    svg.selectAll('*').remove();

    // Get container dimensions with fallback
    const container = sankeyChartRef.current?.parentElement;
    let containerWidth = 400;
    let containerHeight = 250;

    if (container) {
      const containerRect = container.getBoundingClientRect();
      containerWidth = Math.max(300, containerRect.width - 40); // Account for padding
      containerHeight = Math.max(200, containerRect.height - 80); // Account for header
    }

    // Reduced margins to fit better
    const margin = { top: 25, right: 40, bottom: 25, left: 40 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Set viewBox for responsiveness
    svg
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    const svgElement = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Compact node sizing
    const nodeWidth = 8;
    const nodeHeight = 20;
    const groupSpacing = Math.max(80, width / 3.5); // Ensure minimum spacing
    
    // Group nodes by their group
    const groupedNodes = {
      1: sopFlowData.nodes.filter(n => n.group === 1),
      2: sopFlowData.nodes.filter(n => n.group === 2),
      3: sopFlowData.nodes.filter(n => n.group === 3)
    };

    // Position nodes with optimal spacing
    const nodes = [];
    Object.keys(groupedNodes).forEach(groupKey => {
      const group = parseInt(groupKey);
      const groupNodes = groupedNodes[group];
      const availableHeight = height - 40; // Reserve space for labels
      const nodeSpacing = availableHeight / (groupNodes.length + 1);
      
      groupNodes.forEach((node, i) => {
        nodes.push({
          ...node,
          x: (group - 1) * groupSpacing,
          y: 20 + (i + 1) * nodeSpacing - nodeHeight / 2, // Start below group labels
          width: nodeWidth,
          height: nodeHeight
        });
      });
    });

    // Draw links first (behind nodes)
    sopFlowData.links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);
      
      if (source && target) {
        const sourceX = source.x + source.width;
        const sourceY = source.y + source.height / 2;
        const targetX = target.x;
        const targetY = target.y + target.height / 2;
        
        // Improved curve calculation
        const midX1 = sourceX + (targetX - sourceX) * 0.3;
        const midX2 = sourceX + (targetX - sourceX) * 0.7;
        
        const path = d3.path();
        path.moveTo(sourceX, sourceY);
        path.bezierCurveTo(midX1, sourceY, midX2, targetY, targetX, targetY);

        const strokeWidth = Math.max(1, Math.min(6, link.value / 10));

        svgElement.append('path')
          .attr('d', path.toString())
          .attr('fill', 'none')
          .attr('stroke', '#667eea')
          .attr('stroke-width', strokeWidth)
          .attr('stroke-opacity', 0.5)
          .style('cursor', 'pointer')
          .on('mouseover', function(event) {
            d3.select(this)
              .attr('stroke-opacity', 0.8)
              .attr('stroke-width', strokeWidth + 1);
            
            const tooltip = createTooltip();
            tooltip.transition().duration(200).style('opacity', 1);
            tooltip.html(`
              <div style="text-align: center;">
                <strong>${link.source} → ${link.target}</strong><br/>
                <span style="color: #ffd700;">Flow:</span> ${link.value} SOPs<br/>
                <span style="color: #ffd700;">Rate:</span> ${((link.value / 160) * 100).toFixed(1)}%
              </div>
            `)
              .style('left', (event.pageX + 10) + 'px')
              .style('top', (event.pageY - 10) + 'px');
          })
          .on('mouseout', function() {
            d3.select(this)
              .attr('stroke-opacity', 0.5)
              .attr('stroke-width', strokeWidth);
            d3.selectAll('.tooltip').remove();
          });
      }
    });

    // Draw nodes
    svgElement.selectAll('.node')
      .data(nodes)
      .enter().append('rect')
      .attr('class', 'node')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', d => {
        if (d.group === 1) return '#667eea';
        if (d.group === 2) return '#764ba2';
        return '#43e97b';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('rx', 1)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', 2);
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong>${d.id}</strong><br/>
            <span style="color: #ffd700;">Stage:</span> ${d.group === 1 ? 'Input' : d.group === 2 ? 'Categories' : 'Results'}<br/>
            <span style="color: #ffd700;">Type:</span> ${d.group === 2 ? 'SOP Type' : 'Status'}
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', 1);
        d3.selectAll('.tooltip').remove();
      });

    // Add compact node labels
    svgElement.selectAll('.node-label')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'node-label')
      .attr('x', d => {
        if (d.group === 1) return d.x - 3;
        if (d.group === 3) return d.x + d.width + 3;
        return d.x + d.width / 2;
      })
      .attr('y', d => d.y + d.height / 2)
      .attr('dy', d => d.group === 2 ? '-12px' : '0.35em')
      .attr('text-anchor', d => {
        if (d.group === 1) return 'end';
        if (d.group === 3) return 'start';
        return 'middle';
      })
      .style('font-size', '9px')
      .style('font-weight', '500')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .text(d => {
        // Truncate long labels
        if (d.id.length > 8) return d.id.substring(0, 6) + '...';
        return d.id;
      });

    // Add group headers
    const groupLabels = [
      { x: 0, label: 'Input', color: '#667eea' },
      { x: groupSpacing, label: 'Categories', color: '#764ba2' },
      { x: groupSpacing * 2, label: 'Results', color: '#43e97b' }
    ];

    svgElement.selectAll('.group-header')
      .data(groupLabels)
      .enter().append('text')
      .attr('class', 'group-header')
      .attr('x', d => d.x + nodeWidth / 2)
      .attr('y', 10)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .style('fill', d => d.color)
      .text(d => d.label);

    // Add flow statistics
    const totalFlow = sopFlowData.links.reduce((sum, link) => sum + link.value, 0);
    svgElement.append('text')
      .attr('x', width / 2)
      .attr('y', height + 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '9px')
      .style('fill', '#666')
      .text(`Total Flow: ${totalFlow} SOPs`);
  };

  // Parallel Coordinates Chart
  const createParallelCoords = () => {
    const svg = d3.select(parallelCoordsRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 30, right: 50, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const dimensions = ['complexity', 'time', 'success', 'efficiency'];
    const y = {};

    // Create scales for each dimension
    dimensions.forEach(dim => {
      y[dim] = d3.scaleLinear()
        .domain(d3.extent(parallelCoordsData, d => d[dim]))
        .range([height, 0]);
    });

    const x = d3.scalePoint()
      .range([0, width])
      .domain(dimensions);

    const line = d3.line();
    const path = d => line(dimensions.map(p => [x(p), y[p](d[p])]));

    // Add lines
    svgElement.selectAll('.team-line')
      .data(parallelCoordsData)
      .enter().append('path')
      .attr('class', 'team-line')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', (d, i) => d3.schemeCategory10[i])
      .style('stroke-width', 2)
      .style('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1).style('stroke-width', 3);
        const tooltip = createTooltip();
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
          <div style="text-align: center;">
            <strong>${d.name}</strong><br/>
            Complexity: ${d.complexity}/10<br/>
            Time: ${d.time}hrs<br/>
            Success: ${d.success}%<br/>
            Efficiency: ${d.efficiency}%
          </div>
        `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.7).style('stroke-width', 2);
        d3.selectAll('.tooltip').remove();
      });

    // Add axes
    dimensions.forEach(dim => {
      const axis = svgElement.append('g')
        .attr('transform', `translate(${x(dim)}, 0)`)
        .call(d3.axisLeft(y[dim]).ticks(5));

      axis.append('text')
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text(dim.charAt(0).toUpperCase() + dim.slice(1));
    });
  };

  // Violin Plot for Distribution Analysis
  const createViolinPlot = () => {
    const svg = d3.select(violinPlotRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.bottom - margin.top;

    const svgElement = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(violinPlotData.map(d => d.category))
      .range([0, width])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, 5])
      .range([height, 0]);

    // Add axes
    svgElement.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svgElement.append('g')
      .call(d3.axisLeft(yScale));

    // Create violin shapes (simplified as box plots with median and quartiles)
    violinPlotData.forEach(category => {
      const values = category.values.sort((a, b) => a - b);
      const q1 = d3.quantile(values, 0.25);
      const median = d3.quantile(values, 0.5);
      const q3 = d3.quantile(values, 0.75);
      const min = values[0];
      const max = values[values.length - 1];

      const x = xScale(category.category);
      const violinWidth = xScale.bandwidth();

      // Box
      svgElement.append('rect')
        .attr('x', x + violinWidth * 0.25)
        .attr('y', yScale(q3))
        .attr('width', violinWidth * 0.5)
        .attr('height', yScale(q1) - yScale(q3))
        .attr('fill', '#667eea')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#333');

      // Median line
      svgElement.append('line')
        .attr('x1', x + violinWidth * 0.25)
        .attr('x2', x + violinWidth * 0.75)
        .attr('y1', yScale(median))
        .attr('y2', yScale(median))
        .attr('stroke', '#333')
        .attr('stroke-width', 2);

      // Whiskers
      svgElement.append('line')
        .attr('x1', x + violinWidth * 0.5)
        .attr('x2', x + violinWidth * 0.5)
        .attr('y1', yScale(q1))
        .attr('y2', yScale(min))
        .attr('stroke', '#333');

      svgElement.append('line')
        .attr('x1', x + violinWidth * 0.5)
        .attr('x2', x + violinWidth * 0.5)
        .attr('y1', yScale(q3))
        .attr('y2', yScale(max))
        .attr('stroke', '#333');

      // End caps
      svgElement.append('line')
        .attr('x1', x + violinWidth * 0.4)
        .attr('x2', x + violinWidth * 0.6)
        .attr('y1', yScale(min))
        .attr('y2', yScale(min))
        .attr('stroke', '#333');

      svgElement.append('line')
        .attr('x1', x + violinWidth * 0.4)
        .attr('x2', x + violinWidth * 0.6)
        .attr('y1', yScale(max))
        .attr('y2', yScale(max))
        .attr('stroke', '#333');

      // Add individual points
      values.forEach(value => {
        svgElement.append('circle')
          .attr('cx', x + violinWidth * 0.5 + (Math.random() - 0.5) * violinWidth * 0.3)
          .attr('cy', yScale(value))
          .attr('r', 2)
          .attr('fill', '#667eea')
          .attr('fill-opacity', 0.6);
      });
    });

    // Add title
    svgElement.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Execution Time Distribution by Category');
  };

  const handleRefresh = () => {
    showNotification('Analytics data refreshed successfully!');
    if (selectedChartView === 'overview') {
      createSOPSuccessChart();
      createMonthlyTrendsChart();
      createCategoryPerformanceChart();
      createExecutionTimeChart();
    } else if (selectedChartView === 'advanced') {
      createPriorityDistributionChart();
      createTeamPerformanceChart();
      createActivityHeatmap();
      createImprovementTrendChart();
    } else if (selectedChartView === 'interactive') {
      createRadarChart();
      createBubbleChart();
              createFunnelChart();
        createTreemap();
        createGaugeChart();
        createSankeyChart();
        createParallelCoords();
        createWaterfallChart();
        createViolinPlot();
      }
    };

  const handleExport = () => {
    showNotification('Analytics report exported successfully!');
  };

  const handleChartViewChange = (view) => {
    setSelectedChartView(view);
  };

  const renderOverviewCharts = () => (
    <>
      {/* Charts Row */}
      <Row className="theme-mb-2xl">
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiChartPie className="me-2" />
                Success Rate Overview
              </h5>
            </div>
            <div className="theme-card-body theme-text-center">
              <svg ref={sopSuccessRef}></svg>
              <div className="mt-3">
                <Row className="text-center">
                  {sopSuccessData.map((item, index) => (
                    <Col key={index} xs={6} className="mb-2">
                      <div className="d-flex align-items-center justify-content-center">
                        <div 
                          className="rounded-circle me-2"
                          style={{ 
                            width: '12px', 
                            height: '12px', 
                            backgroundColor: item.color 
                          }}
                        ></div>
                        <small className="text-muted">{item.status}: {item.count}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiChartBar className="me-2" />
                Monthly Trends
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={monthlyTrendsRef}></svg>
              <div className="mt-3 text-center">
                <span className="theme-badge theme-badge-success me-2">Completed</span>
                <span className="theme-badge theme-badge-danger">Failed</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Second Row */}
      <Row className="theme-mb-2xl">
        <Col lg={8} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiChartBar className="me-2" />
                Category Performance
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={categoryPerformanceRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={4} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiClock className="me-2" />
                Execution Time Distribution
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={executionTimeRef}></svg>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );

  const renderAdvancedCharts = () => (
    <>
      <Row className="theme-mb-2xl">
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiBarsArrowUp className="me-2" />
                Priority Distribution
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={priorityDistributionRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiArrowTrendingUp className="me-2" />
                Improvement Trends
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={improvementTrendRef}></svg>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="theme-mb-2xl">
        <Col lg={8} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiMapPin className="me-2" />
                Daily Activity Heatmap
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={activityHeatmapRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={4} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiCircleStack className="me-2" />
                Team Performance
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={teamPerformanceRef}></svg>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );

  const renderInteractiveCharts = () => (
    <>
      <Row className="theme-mb-2xl">
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiBeaker className="me-2" />
                Team Comparison Radar
              </h5>
            </div>
            <div className="theme-card-body theme-text-center">
              <svg ref={radarChartRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiCubeTransparent className="me-2" />
                Efficiency vs Workload
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={bubbleChartRef}></svg>
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Interactive Charts Row 1 */}
      <Row className="theme-mb-2xl">
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiBarsArrowUp className="me-2" />
                SOP Conversion Funnel
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={funnelChartRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiCircleStack className="me-2" />
                Category Distribution Treemap
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={treemapRef}></svg>
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Interactive Charts Row 2 */}
      <Row className="theme-mb-2xl">
        <Col lg={12} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiSignal className="me-2" />
                Performance Gauges
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={gaugeChartRef}></svg>
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Interactive Charts Row 3 */}
      <Row className="theme-mb-2xl">
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiArrowTrendingUp className="me-2" />
                SOP Flow Analysis
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={sankeyChartRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiMapPin className="me-2" />
                Multi-Dimensional Analysis
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={parallelCoordsRef}></svg>
            </div>
          </div>
        </Col>
      </Row>

      {/* Additional Interactive Charts Row 4 */}
      <Row className="theme-mb-2xl">
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiBarsArrowUp className="me-2" />
                SOP Volume Changes
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={waterfallChartRef}></svg>
            </div>
          </div>
        </Col>
        <Col lg={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiBeaker className="me-2" />
                Execution Time Distribution
              </h5>
            </div>
            <div className="theme-card-body">
              <svg ref={violinPlotRef}></svg>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );

  return (
    <Container fluid className="theme-fade-in">
      {notification && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <HiCheckCircle className="me-2" />
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="theme-page-header theme-mb-2xl">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Tooltip title="Back to Dashboard">
              <IconButton 
                onClick={() => navigate('/')} 
                className="me-3 theme-btn theme-btn-primary p-3 ms-1"
                style={{ color: 'white' }}
              >
                <HiArrowLeft />
              </IconButton>
            </Tooltip>
            <div>
              <h1 className="theme-page-title">
                <HiChartBar style={{ color: 'var(--primary-color)' }} className="me-2" />
                Knowledge Assist Analytics
              </h1>
              <p className="theme-page-subtitle">
                Comprehensive insights into SOP performance and execution metrics
              </p>
            </div>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <ButtonGroup>
              <Button 
                variant={selectedChartView === 'overview' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => handleChartViewChange('overview')}
              >
                <HiEye className="me-1" />
                Overview
              </Button>
              <Button 
                variant={selectedChartView === 'advanced' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => handleChartViewChange('advanced')}
              >
                <HiSignal className="me-1" />
                Advanced
              </Button>
              <Button 
                variant={selectedChartView === 'interactive' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => handleChartViewChange('interactive')}
              >
                <HiCubeTransparent className="me-1" />
                Interactive
              </Button>
            </ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle className="theme-btn theme-btn-primary" size="sm">
                <HiFunnel className="me-2" />
                {selectedTimeRange}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSelectedTimeRange('Last 7 Days')}>Last 7 Days</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedTimeRange('Last 30 Days')}>Last 30 Days</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedTimeRange('Last 3 Months')}>Last 3 Months</Dropdown.Item>
                <Dropdown.Item onClick={() => setSelectedTimeRange('Last 12 Months')}>Last 12 Months</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button 
              className="theme-btn theme-btn-secondary"
              onClick={handleRefresh}
              title="Refresh Data"
            >
              <HiArrowPath />
            </button>
            <button 
              className="theme-btn theme-btn-primary me-1"
              onClick={handleExport}
              title="Export Report"
            >
              <HiArrowDownTray className="me-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <Row className="theme-mb-2xl">
        <Col md={3} className="mb-4">
          <div className="theme-kpi-card">
            <div className="theme-kpi-icon">
              <HiDocument />
            </div>
            <div className="theme-kpi-value">{kpiMetrics.totalSOPs}</div>
            <div className="theme-kpi-label">Total SOPs</div>
          </div>
        </Col>
        <Col md={3} className="mb-4">
          <div className="theme-kpi-card">
            <div className="theme-kpi-icon">
              <HiCheckCircle />
            </div>
            <div className="theme-kpi-value">{kpiMetrics.completedSOPs}</div>
            <div className="theme-kpi-label">Completed SOPs</div>
          </div>
        </Col>
        <Col md={3} className="mb-4">
          <div className="theme-kpi-card">
            <div className="theme-kpi-icon">
              <HiClock />
            </div>
            <div className="theme-kpi-value">{kpiMetrics.averageExecutionTime}</div>
            <div className="theme-kpi-label">Avg. Execution Time</div>
          </div>
        </Col>
        <Col md={3} className="mb-4">
          <div className="theme-kpi-card">
            <div className="theme-kpi-icon">
              <HiClipboardDocumentList />
            </div>
            <div className="theme-kpi-value">{kpiMetrics.duplicateSOPs}</div>
            <div className="theme-kpi-label">Duplicate SOPs</div>
          </div>
        </Col>
      </Row>

      {/* Dynamic Chart Content */}
      {selectedChartView === 'overview' && renderOverviewCharts()}
      {selectedChartView === 'advanced' && renderAdvancedCharts()}
      {selectedChartView === 'interactive' && renderInteractiveCharts()}

      {/* Summary Cards */}
      <Row>
        <Col md={6} className="mb-4">
          <div className="theme-card overflow-y-auto">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiExclamationTriangle className="me-2" />
                Error Analysis
              </h5>
            </div>
            <div className="theme-card-body">
              {errorAnalysisData.slice(0, 5).map((error, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div className="d-flex align-items-center">
                    <Badge 
                      bg={error.impact === 'High' ? 'danger' : error.impact === 'Medium' ? 'warning' : 'success'}
                      className="me-3"
                    >
                      {error.count}
                    </Badge>
                    <div>
                      <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{error.errorType}</div>
                      <small style={{ color: 'var(--text-secondary)' }}>Impact: {error.impact}</small>
                    </div>
                  </div>
                  <ProgressBar 
                    now={(error.count / 15) * 100} 
                    style={{ width: '100px', height: '8px' }}
                    variant={error.impact === 'High' ? 'danger' : error.impact === 'Medium' ? 'warning' : 'success'}
                  />
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="theme-card">
            <div className="theme-card-header">
              <h5 className="theme-card-title">
                <HiTrophy className="me-2" />
                Key Metrics
              </h5>
            </div>
            <div className="theme-card-body">
              <Row>
                <Col sm={6} className="mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-success mb-1">{kpiMetrics.successRate}%</h4>
                    <small className="text-muted">Success Rate</small>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-info mb-1">{kpiMetrics.teamEfficiency}%</h4>
                    <small className="text-muted">Team Efficiency</small>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-warning mb-1">{kpiMetrics.criticalFailures}</h4>
                    <small className="text-muted">Critical Failures</small>
                  </div>
                </Col>
                <Col sm={6} className="mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <h4 className="text-primary mb-1">{kpiMetrics.costSavings}</h4>
                    <small className="text-muted">Cost Savings</small>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>

      {/* Extended Analytics Section - Below Tables */}
      <div className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="h4" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
              <HiSparkles className="me-2" />
              Extended Analytics Dashboard
            </h2>
            <p className="text-muted mb-0">Advanced visualizations and in-depth analysis</p>
          </div>
        </div>

        {/* Comprehensive Chart Grid */}
        <Row className="theme-mb-2xl">
          {/* Real-time Performance Metrics */}
          <Col lg={4} className="mb-4">
            <div className="theme-card" style={{ height: '350px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiSignal className="me-2" />
                  Real-time Metrics
                </h5>
              </div>
              <div className="theme-card-body d-flex flex-column">
                <div className="flex-grow-1">
                  <svg ref={gaugeChartRef}></svg>
                </div>
              </div>
            </div>
          </Col>

          {/* SOP Process Flow */}
          <Col lg={4} className="mb-4">
            <div className="theme-card" style={{ height: '350px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiPresentationChartLine className="me-2" />
                  Process Flow Analysis
                </h5>
              </div>
              <div className="theme-card-body">
                <svg ref={sankeyChartRef}></svg>
              </div>
            </div>
          </Col>

          {/* Conversion Funnel */}
          <Col lg={4} className="mb-4">
            <div className="theme-card" style={{ height: '350px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiBarsArrowUp className="me-2" />
                  Conversion Analysis
                </h5>
              </div>
              <div className="theme-card-body">
                <svg ref={funnelChartRef}></svg>
              </div>
            </div>
          </Col>
        </Row>

        {/* Second Row - Distribution & Correlation */}
        <Row className="theme-mb-2xl">
          {/* Category Treemap */}
          <Col lg={6} className="mb-4">
            <div className="theme-card" style={{ height: '350px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiCircleStack className="me-2" />
                  Resource Distribution
                </h5>
              </div>
              <div className="theme-card-body">
                <svg ref={treemapRef}></svg>
              </div>
            </div>
          </Col>

          {/* Volume Changes */}
          <Col lg={6} className="mb-4">
            <div className="theme-card" style={{ height: '350px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiChartBarSquare className="me-2" />
                  Volume Changes
                </h5>
              </div>
              <div className="theme-card-body">
                <svg ref={waterfallChartRef}></svg>
              </div>
            </div>
          </Col>
        </Row>

        {/* Third Row - Advanced Analysis */}
        <Row className="theme-mb-2xl">
          {/* Multi-dimensional Analysis */}
          <Col lg={6} className="mb-4">
            <div className="theme-card" style={{ height: '300px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiMapPin className="me-2" />
                  Multi-Dimensional Analysis
                </h5>
              </div>
              <div className="theme-card-body">
                <svg ref={parallelCoordsRef}></svg>
              </div>
            </div>
          </Col>

          {/* Distribution Analysis */}
          <Col lg={6} className="mb-4">
            <div className="theme-card" style={{ height: '300px' }}>
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiBeaker className="me-2" />
                  Distribution Analysis
                </h5>
              </div>
              <div className="theme-card-body">
                <svg ref={violinPlotRef}></svg>
              </div>
            </div>
          </Col>
        </Row>

        {/* Analytics Insights Summary */}
        <Row className="theme-mb-2xl">
          <Col lg={12}>
            <div className="theme-card">
              <div className="theme-card-header">
                <h5 className="theme-card-title">
                  <HiLightBulb className="me-2" />
                  Analytics Insights
                </h5>
              </div>
              <div className="theme-card-body">
                <Row>
                  <Col md={3} className="mb-3">
                    <div className="insight-card p-3 rounded" style={{ backgroundColor: '#e3f2fd', border: '1px solid #bbdefb' }}>
                      <div className="d-flex align-items-center mb-2">
                        <HiTrophy style={{ color: '#1976d2', fontSize: '1.2rem', marginRight: '0.5rem' }} />
                        <strong style={{ color: '#1976d2' }}>Top Performer</strong>
                      </div>
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>DevOps Team shows highest efficiency at 96.1%</p>
                      <small className="text-muted">Recommended for best practices sharing</small>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="insight-card p-3 rounded" style={{ backgroundColor: '#f3e5f5', border: '1px solid #e1bee7' }}>
                      <div className="d-flex align-items-center mb-2">
                        <HiExclamationTriangle style={{ color: '#7b1fa2', fontSize: '1.2rem', marginRight: '0.5rem' }} />
                        <strong style={{ color: '#7b1fa2' }}>Alert</strong>
                      </div>
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>Database category has 16% failure rate</p>
                      <small className="text-muted">Requires immediate attention</small>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="insight-card p-3 rounded" style={{ backgroundColor: '#e8f5e8', border: '1px solid #c8e6c9' }}>
                      <div className="d-flex align-items-center mb-2">
                        <HiArrowTrendingUp style={{ color: '#388e3c', fontSize: '1.2rem', marginRight: '0.5rem' }} />
                        <strong style={{ color: '#388e3c' }}>Trend</strong>
                      </div>
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>Success rate improved 16% this quarter</p>
                      <small className="text-muted">Exceeding target by 1.2%</small>
                    </div>
                  </Col>
                  <Col md={3} className="mb-3">
                    <div className="insight-card p-3 rounded" style={{ backgroundColor: '#fff3e0', border: '1px solid #ffcc02' }}>
                      <div className="d-flex align-items-center mb-2">
                        <HiLightBulb style={{ color: '#f57c00', fontSize: '1.2rem', marginRight: '0.5rem' }} />
                        <strong style={{ color: '#f57c00' }}>Opportunity</strong>
                      </div>
                      <p className="mb-1" style={{ fontSize: '0.9rem' }}>Peak activity: 2-4 PM on weekdays</p>
                      <small className="text-muted">Optimize resource allocation</small>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
                     </Col>
         </Row>
       </div>
    </Container>
  );
};

export default Analytics; 