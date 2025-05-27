import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './RecursiveTree.css';

export const RecursiveTree = ({ 
  data, 
  activeNodes = [], 
  completedNodes = [],
  currentArray = [],
  currentStep = '',
  highlightedIndices = []
}) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 900;
    const height = 500;
    const margin = { top: 20, right: 100, bottom: 30, left: 200 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .html('');

    // Add a container group with translation for the entire tree
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tree layout
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
      .separation((a, b) => (a.parent === b.parent ? 2 : 2.5));

    treeLayout(root);

    // Add links (branches) with animation
    g.append('g')
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x))
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => {
        if (activeNodes.includes(d.target.data.id)) return 3;
        if (completedNodes.includes(d.target.data.id)) return 2;
        return 1;
      })
      .attr('stroke', d => {
        if (activeNodes.includes(d.target.data.id)) return '#4dabf7';
        if (completedNodes.includes(d.target.data.id)) return '#51cf66';
        return '#ced4da';
      });

    // Create node groups
    const node = g.append('g')
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    // Add node circles with animation
    node.append('circle')
      .attr('r', 15)
      .attr('class', d => {
        let classes = 'node-circle';
        if (activeNodes.includes(d.data.id)) classes += ' active';
        if (completedNodes.includes(d.data.id)) classes += ' completed';
        if (d.data.isBaseCase) classes += ' base-case';
        return classes;
      })
      .attr('fill', d => {
        if (activeNodes.includes(d.data.id)) return '#4dabf7';
        if (completedNodes.includes(d.data.id)) return '#51cf66';
        if (d.data.isBaseCase) return '#94d82d';
        return '#adb5bd';
      })
      .attr('stroke', d => {
        if (activeNodes.includes(d.data.id)) return '#1971c2';
        if (completedNodes.includes(d.data.id)) return '#2b8a3e';
        if (d.data.isBaseCase) return '#5c940d';
        return '#868e96';
      })
      .attr('stroke-width', d => activeNodes.includes(d.data.id) ? 3 : 2);

    // Add node text (T(n))
    node.append('text')
      .attr('dy', -20)
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .attr('class', 'node-label');

    // Add array visualization in nodes
    node.each(function(d) {
      const nodeGroup = d3.select(this);
      const array = d.data.array || [];
      const maxValue = Math.max(...array, 1);
      const isActive = activeNodes.includes(d.data.id);
      const isCompleted = completedNodes.includes(d.data.id);
      const isBaseCase = d.data.isBaseCase;
      
      // Create mini array visualization
      const arrayGroup = nodeGroup.append('g')
        .attr('class', 'mini-array')
        .attr('transform', 'translate(-40, 20)');

      array.forEach((value, i) => {
        const isHighlighted = highlightedIndices.includes(
          parseInt(d.data.range?.split('-')[0] || 0) + i
        );
        
        arrayGroup.append('rect')
          .attr('x', i * 10)
          .attr('y', 0)
          .attr('width', 8)
          .attr('height', (value / maxValue) * 30)
          .attr('class', `mini-bar ${isHighlighted ? 'highlighted' : ''}`)
          .attr('fill', () => {
            if (isHighlighted) return '#ff6b6b';
            if (isCompleted) return '#51cf66';
            if (isActive) return '#4dabf7';
            if (isBaseCase) return '#94d82d';
            return '#adb5bd';
          })
          .attr('stroke', () => {
            if (isHighlighted) return '#c92a2a';
            if (isCompleted) return '#2b8a3e';
            if (isActive) return '#1971c2';
            if (isBaseCase) return '#5c940d';
            return '#495057';
          })
          .attr('stroke-width', isHighlighted || isActive ? 2 : 1);
      });
    });

    // Add cost information
    node.append('text')
      .attr('dy', 50)
      .attr('text-anchor', 'middle')
      .text(d => d.data.cost || '')
      .attr('class', 'cost-label');

    // Add current operation indicator
    if (currentStep) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .text(currentStep)
        .attr('class', 'step-indicator');
    }

  }, [data, activeNodes, completedNodes, currentStep, highlightedIndices]);

  return (
    <div className="tree-container">
      <svg ref={svgRef} />
      <div className="tree-legend">
        <div><span className="legend-dot active"></span> Active</div>
        <div><span className="legend-dot completed"></span> Completed</div>
        <div><span className="legend-dot base-case"></span> Base Case</div>
        <div><span className="legend-dot highlighted"></span> Comparing</div>
      </div>
    </div>
  );
};