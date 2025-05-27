import React from 'react';
import './SortingFrames.css';

export const SortingFrames = ({ frames, currentFrame, onFrameSelect }) => {
  return (
    <div className="sorting-frames">
      <h3>Sorting Steps</h3>
      <div className="frames-container">
        {frames.map((frame, index) => (
          <div
            key={index}
            className={`frame ${currentFrame === index ? 'active' : ''}`}
            onClick={() => onFrameSelect(index)}
          >
            <div className="frame-header">
              <span className="frame-number">#{index + 1}</span>
              <span className="frame-type">{frame.type}</span>
            </div>
            <div className="frame-preview">
              {frame.array.map((value, i) => (
                <div
                  key={i}
                  className={`frame-bar ${
                    frame.highlightedIndices?.includes(i) ? 'highlighted' : ''
                  }`}
                  style={{ height: `${(value / Math.max(...frame.array)) * 100}%` }}
                />
              ))}
            </div>
            <div className="frame-description">{frame.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 