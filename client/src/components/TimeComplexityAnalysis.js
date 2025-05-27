import React from 'react';
import './TimeComplexityAnalysis.css';

export const TimeComplexityAnalysis = ({ arraySize }) => {
  // Calculate complexity metrics
  const recursionDepth = Math.ceil(Math.log2(arraySize));
  const totalOperations = arraySize * Math.ceil(Math.log2(arraySize));
  const extraSpace = arraySize; // Merge sort needs O(n) extra space

  return (
    <div className="complexity-analysis">
      <h2>Time Complexity Analysis</h2>
      
      <div className="analysis-section">
        <h3>Current Analysis</h3>
        <div className="metric">
          <label>Input Size (n):</label>
          <span>{arraySize}</span>
        </div>
        <div className="metric">
          <label>Recursion Depth:</label>
          <span>{recursionDepth} levels (log₂n = {Math.log2(arraySize).toFixed(2)})</span>
        </div>
        <div className="metric">
          <label>Expected Operations:</label>
          <span>≈ {totalOperations} comparisons</span>
        </div>
        <div className="metric">
          <label>Extra Space:</label>
          <span>{extraSpace} elements</span>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Complexity Breakdown</h3>
        <div className="breakdown">
          <h4>Time Complexity: O(n log n)</h4>
          <ul>
            <li>Dividing: O(1) at each level</li>
            <li>Merging: O(n) at each level</li>
            <li>Levels: O(log n) due to binary recursion</li>
            <li>Total: O(n) * O(log n) = O(n log n)</li>
          </ul>
        </div>
        <div className="breakdown">
          <h4>Space Complexity: O(n)</h4>
          <ul>
            <li>Temporary array in merge: O(n)</li>
            <li>Recursion stack: O(log n)</li>
            <li>Maximum: O(n)</li>
          </ul>
        </div>
      </div>

      <div className="analysis-section">
        <h3>Explanation</h3>
        <p>
          Merge Sort divides the array into two halves recursively until reaching single elements,
          then merges them back in sorted order. The process creates a binary recursion tree with
          log₂(n) levels, where n is the array size.
        </p>
        <p>
          At each level, all n elements are processed during merging, resulting in n*log(n)
          total operations. The extra space requirement comes from the temporary arrays used
          during merging (O(n)) and the recursion stack (O(log n)).
        </p>
      </div>
    </div>
  );
}; 