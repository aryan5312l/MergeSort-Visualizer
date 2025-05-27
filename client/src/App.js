import React, { useState } from 'react';
import { RecursiveTree } from './components/RecursiveTree';
import { ArrayVisualizer } from './components/ArrayVisualizer';
import { TimeComplexityAnalysis } from './components/TimeComplexityAnalysis';
import { RecurrenceSolver } from './components/RecurrenceSolver';
import { Quiz } from './components/Quiz';
import { SortingFrames } from './components/SortingFrames';
import './App.css';

function App() {
  const [inputArray, setInputArray] = useState('8,3,5,1,9,6');
  const [arraySize, setArraySize] = useState(6);
  const [array, setArray] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [currentStep, setCurrentStep] = useState('Ready to sort');
  const [sorting, setSorting] = useState(false);
  const [activeNodes, setActiveNodes] = useState([]);
  const [speed, setSpeed] = useState('medium');
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [completedNodes, setCompletedNodes] = useState([]);
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const speeds = {
    slow: 1000,
    medium: 500,
    fast: 100
  };

  const generateRandomArray = () => {
    const size = Math.max(1, Math.min(20, parseInt(arraySize) || 6)); // Limit size between 1 and 20
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setInputArray(randomArray.join(','));
    setArraySize(size);
  };

  const generateTreeData = (arr, path = [], start = 0, end = arr.length - 1) => {
    if (end - start <= 0) {
      return {
        id: path.length ? path.join('-') : 'base',
        name: `T(${end - start + 1})`,
        value: arr[start] ? arr[start].toString() : '',
        range: `${start}-${end}`,
        isBaseCase: true,
        array: arr.slice(start, end + 1)
      };
    }

    const mid = Math.floor((start + end) / 2);
    const leftRange = `${start}-${mid}`;
    const rightRange = `${mid + 1}-${end}`;

    return {
      id: path.length ? path.join('-') : 'root',
      name: `T(${end - start + 1})`,
      range: `${start}-${end}`,
      cost: `O(${end - start + 1})`,
      array: arr.slice(start, end + 1),
      children: [
        generateTreeData(arr, [...path, leftRange], start, mid),
        generateTreeData(arr, [...path, rightRange], mid + 1, end)
      ]
    };
  };

  const addFrame = (array, type, description, highlightedIndices = [], activeNodes = [], completedNodes = []) => {
    setFrames(prev => [...prev, {
      array: [...array],
      type,
      description,
      highlightedIndices,
      activeNodes,
      completedNodes
    }]);
  };

  const handleFrameSelect = (index) => {
    setCurrentFrameIndex(index);
    const frame = frames[index];
    setArray([...frame.array]);
    setHighlightedIndices(frame.highlightedIndices);
    setActiveNodes(frame.activeNodes);
    setCompletedNodes(frame.completedNodes);
    setCurrentStep(frame.description);
  };

  const performMergeSort = async () => {
    if (!inputArray || sorting) return;
    
    try {
      // Initialize all states
      const arr = inputArray.split(',').map(Number).filter(n => !isNaN(n));
      setArray([...arr]);
      setTreeData(generateTreeData(arr));
      setSorting(true);
      setCurrentStep('Starting merge sort');
      setActiveNodes(['root']);
      setCompletedNodes([]);
      setHighlightedIndices([]);
      setFrames([]); // Reset frames
      setCurrentFrameIndex(0);

      // Add initial frame
      addFrame(arr, 'Initial', 'Starting merge sort', [], ['root'], []);

      // Create a copy to work with
      const arrCopy = [...arr];
      
      // Perform the sort
      await mergeSort(arrCopy, 0, arr.length - 1, 'root');
      
      // Final update
      setArray([...arrCopy]);
      setCurrentStep('Sorting completed!');
      setCompletedNodes(['root']);
      addFrame(arrCopy, 'Complete', 'Sorting completed!', [], [], ['root']);
    } catch (error) {
      console.error('Sorting error:', error);
      setCurrentStep('Error during sorting');
    } finally {
      setSorting(false);
      setActiveNodes([]);
      setHighlightedIndices([]);
    }
  };

  const mergeSort = async (arr, left, right, nodeId) => {
    if (left >= right) {
      // Base case visualization
      setCompletedNodes(prev => [...prev, nodeId]);
      setCurrentStep(`Base case reached: [${arr[left]}]`);
      setHighlightedIndices([left]);
      setTreeData(prev => {
        const newData = generateTreeData([...arr]);
        return newData;
      });
      addFrame(arr, 'Base Case', `Base case reached: [${arr[left]}]`, [left], [], [nodeId]);
      await sleep(speeds[speed]);
      return;
    }

    const mid = Math.floor((left + right) / 2);
    const leftNodeId = `${nodeId}-${left}-${mid}`;
    const rightNodeId = `${nodeId}-${mid + 1}-${right}`;

    // Divide visualization
    setCurrentStep(`Dividing: ${arr.slice(left, right + 1).join(', ')}`);
    setActiveNodes([nodeId]);
    setHighlightedIndices(Array.from({length: right - left + 1}, (_, i) => left + i));
    setTreeData(prev => {
      const newData = generateTreeData([...arr]);
      return newData;
    });
    addFrame(
      arr,
      'Divide',
      `Dividing: ${arr.slice(left, right + 1).join(', ')}`,
      Array.from({length: right - left + 1}, (_, i) => left + i),
      [nodeId],
      []
    );
    await sleep(speeds[speed]);

    // Recursively sort left half
    await mergeSort(arr, left, mid, leftNodeId);

    // Recursively sort right half
    await mergeSort(arr, mid + 1, right, rightNodeId);

    // Merge visualization
    setCurrentStep(`Merging: ${arr.slice(left, right + 1).join(', ')}`);
    setActiveNodes([nodeId, leftNodeId, rightNodeId]);
    setTreeData(prev => {
      const newData = generateTreeData([...arr]);
      return newData;
    });
    addFrame(
      arr,
      'Merge',
      `Merging: ${arr.slice(left, right + 1).join(', ')}`,
      Array.from({length: right - left + 1}, (_, i) => left + i),
      [nodeId, leftNodeId, rightNodeId],
      []
    );
    await sleep(speeds[speed]);

    // Perform the merge
    await merge(arr, left, mid, right);

    // Completion visualization
    setCompletedNodes(prev => [...prev, nodeId]);
    setCurrentStep(`Merged: ${arr.slice(left, right + 1).join(', ')}`);
    setArray([...arr]);
    setTreeData(prev => {
      const newData = generateTreeData([...arr]);
      return newData;
    });
    addFrame(
      arr,
      'Complete Merge',
      `Merged: ${arr.slice(left, right + 1).join(', ')}`,
      Array.from({length: right - left + 1}, (_, i) => left + i),
      [],
      [nodeId]
    );
    await sleep(speeds[speed] / 2);
  };

  const merge = async (arr, left, mid, right) => {
    const temp = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      // Highlight comparison
      setHighlightedIndices([i, j]);
      addFrame(
        arr,
        'Compare',
        `Comparing elements: ${arr[i]} and ${arr[j]}`,
        [i, j],
        [],
        []
      );
      await sleep(speeds[speed] / 3);

      if (arr[i] <= arr[j]) {
        temp.push(arr[i++]);
      } else {
        temp.push(arr[j++]);
      }

      // Visualize current merged state
      const merged = [...arr.slice(0, left), ...temp, ...arr.slice(i, mid + 1), ...arr.slice(j, right + 1)];
      setArray(merged);
      setTreeData(prev => {
        const newData = generateTreeData([...merged]);
        return newData;
      });
      addFrame(
        merged,
        'Merge Progress',
        'Merging in progress...',
        [i - 1, j - 1],
        [],
        []
      );
      await sleep(speeds[speed] / 3);
    }

    // Handle remaining elements
    while (i <= mid) {
      temp.push(arr[i++]);
      setHighlightedIndices([i - 1]);
      const merged = [...arr.slice(0, left), ...temp, ...arr.slice(i, mid + 1), ...arr.slice(j, right + 1)];
      setArray(merged);
      setTreeData(prev => {
        const newData = generateTreeData([...merged]);
        return newData;
      });
      addFrame(
        merged,
        'Copy Left',
        'Copying remaining elements from left half',
        [i - 1],
        [],
        []
      );
      await sleep(speeds[speed] / 4);
    }

    while (j <= right) {
      temp.push(arr[j++]);
      setHighlightedIndices([j - 1]);
      const merged = [...arr.slice(0, left), ...temp, ...arr.slice(i, mid + 1), ...arr.slice(j, right + 1)];
      setArray(merged);
      setTreeData(prev => {
        const newData = generateTreeData([...merged]);
        return newData;
      });
      addFrame(
        merged,
        'Copy Right',
        'Copying remaining elements from right half',
        [j - 1],
        [],
        []
      );
      await sleep(speeds[speed] / 4);
    }

    // Copy back to original array
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      setHighlightedIndices([left + k]);
      setArray([...arr]);
      setTreeData(prev => {
        const newData = generateTreeData([...arr]);
        return newData;
      });
      addFrame(
        arr,
        'Copy Back',
        'Copying sorted elements back to original array',
        [left + k],
        [],
        []
      );
      await sleep(speeds[speed] / 5);
    }
  };

  // Utility function
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="App">
      <div className="author-credit">
        <span className="name">Made By: Aharnish Dubey</span>
        <span className="id">4NI23CS011</span>
      </div>
      <h1>Merge Sort Visualizer</h1>
      <div className="controls">
        <div className="input-group">
          <label>Array Input:</label>
          <input
            type="text"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
            disabled={sorting}
            placeholder="Enter numbers separated by commas"
          />
        </div>
        <div className="input-group">
          <label>Array Size:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={arraySize}
            onChange={(e) => setArraySize(e.target.value)}
            disabled={sorting}
          />
          <button onClick={generateRandomArray} disabled={sorting}>
            Generate Random Array
          </button>
        </div>
        <div className="input-group">
          <label>Speed:</label>
          <select value={speed} onChange={(e) => setSpeed(e.target.value)} disabled={sorting}>
            <option value="slow">Slow</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast</option>
          </select>
          <button onClick={performMergeSort} disabled={sorting}>
            {sorting ? 'Sorting...' : 'Start Sort'}
          </button>
        </div>
      </div>
      <div className="step-display">
        <p>{currentStep}</p>
      </div>
      {array.length > 0 && (
        <>
          <ArrayVisualizer
            array={array}
            highlightedIndices={highlightedIndices}
          />
          <RecursiveTree
            data={treeData}
            activeNodes={activeNodes}
            completedNodes={completedNodes}
            currentArray={array}
            currentStep={currentStep}
            highlightedIndices={highlightedIndices}
          />
          <SortingFrames
            frames={frames}
            currentFrame={currentFrameIndex}
            onFrameSelect={handleFrameSelect}
          />
        </>
      )}
      
      <div className="analysis-container">
        <TimeComplexityAnalysis arraySize={array.length || parseInt(arraySize) || 6} />
        <RecurrenceSolver />
        <Quiz />
      </div>
    </div>
  );
}

export default App;