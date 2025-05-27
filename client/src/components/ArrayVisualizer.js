import React from 'react';
import PropTypes from 'prop-types';
import './ArrayVisualizer.css';

export const ArrayVisualizer = ({ array = [], highlightedIndices = [] }) => {
  const maxValue = Math.max(...array, 1);

  return (
    <div className="array-visualizer">
      {array.map((value, index) => (
        <div 
          key={index}
          className={`array-bar ${
            highlightedIndices.includes(index) ? 'comparing' : ''
          }`}
          style={{
            height: `${(value / maxValue) * 100}%`,
            width: `${100 / array.length}%`
          }}
        >
          <span className="bar-label">{value}</span>
        </div>
      ))}
    </div>
  );
};

ArrayVisualizer.propTypes = {
  array: PropTypes.arrayOf(PropTypes.number),
  highlightedIndices: PropTypes.arrayOf(PropTypes.number)
};