import React, { useState } from 'react';
import axios from 'axios'; // Add this import
import { animated } from '@react-spring/web';

// Changed to named export (remove "default")
export function Visualizer({ array }) {
  const [bars, setBars] = useState(array.map(value => ({ value, color: 'turquoise' })));

  // Define updateBars function
  const updateBars = (prevBars, step) => {
    return prevBars.map((bar, i) => {
      if (i >= step.range[0] && i <= step.range[1]) {
        return { ...bar, color: step.type === 'split' ? 'orange' : 'green' };
      }
      return bar;
    });
  };

  const animateMergeSort = async () => {
    const response = await axios.post('http://localhost:5000/api/sort', { array });
    const steps = response.data.steps;
    
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBars(prev => updateBars(prev, step));
    }
  };

  return (
    <div className="visualizer">
      {bars.map((bar, i) => (
        <animated.div
          key={i}
          style={{
            height: `${bar.value * 5}px`,
            backgroundColor: bar.color,
            width: '20px',
            margin: '0 2px'
          }}
        />
      ))}
      <button onClick={animateMergeSort}>Start Sort</button>
    </div>
  );
}