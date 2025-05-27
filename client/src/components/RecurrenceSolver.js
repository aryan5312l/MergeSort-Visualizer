import React, { useState } from 'react';
import './RecurrenceSolver.css';

export const RecurrenceSolver = () => {
  const [recurrence, setRecurrence] = useState('T(n) = 2T(n/2) + n');
  const [solution, setSolution] = useState(null);

  const solveRecurrence = () => {
    // Parse the recurrence relation
    const parsed = parseRecurrence(recurrence);
    if (!parsed) {
      setSolution({
        error: 'Invalid recurrence format. Please use the format: T(n) = aT(n/b) + f(n)',
      });
      return;
    }

    const { a, b, fn } = parsed;

    // Apply Master Theorem
    const solution = applyMasterTheorem(a, b, fn);
    setSolution(solution);
  };

  const parseRecurrence = (recurrence) => {
    // Basic parser for recurrence relations of the form T(n) = aT(n/b) + f(n)
    try {
      const regex = /T\(n\)\s*=\s*(\d+)T\(n\/(\d+)\)\s*\+\s*(.+)/;
      const match = recurrence.match(regex);
      
      if (!match) return null;

      // eslint-disable-next-line no-unused-vars
      const [_, a, b, fn] = match;
      return {
        a: parseInt(a),
        b: parseInt(b),
        fn: fn.trim()
      };
    } catch (e) {
      return null;
    }
  };

  const getComplexity = (fn) => {
    if (fn === '1') return { power: 0, hasLog: false };
    if (fn === 'n') return { power: 1, hasLog: false };
    if (fn === 'log n' || fn === 'logn') return { power: 0, hasLog: true };
    
    // Handle n^k cases
    const powerMatch = fn.match(/n\^?(\d*)/);
    if (powerMatch) {
      const power = powerMatch[1] ? parseInt(powerMatch[1]) : 1;
      const hasLog = fn.includes('log');
      return { power, hasLog };
    }
    
    return { power: 0, hasLog: false };
  };

  const applyMasterTheorem = (a, b, fn) => {
    // Calculate logb(a)
    const logba = Math.log(a) / Math.log(b);
    
    // Analyze f(n)
    const { power: k, hasLog } = getComplexity(fn);
    
    // Apply Master Theorem cases
    let result;
    let explanation;
    let epsilon = 0.01; // Small value for comparing floating point numbers

    // Case 1: f(n) = O(n^(logb(a) - ε))
    if (k < logba) {
      result = `O(n^${logba.toFixed(2)})`;
      explanation = `Case 1: f(n) = O(n^${k}) is polynomially smaller than n^${logba.toFixed(2)}`;
    }
    // Case 2: f(n) = Θ(n^logb(a))
    else if (Math.abs(k - logba) < epsilon && !hasLog) {
      result = `O(n^${k} log n)`;
      explanation = `Case 2: f(n) = Θ(n^${k}) matches n^${logba.toFixed(2)}`;
    }
    // Case 2b: f(n) = Θ(n^logb(a) * log^k(n))
    else if (Math.abs(k - logba) < epsilon && hasLog) {
      result = `O(n^${k} log^2 n)`;
      explanation = `Case 2: f(n) = Θ(n^${k} log n) matches n^${logba.toFixed(2)} with extra log factor`;
    }
    // Case 3: f(n) = Ω(n^(logb(a) + ε)) and af(n/b) ≤ cf(n)
    else if (k > logba) {
      result = `O(n^${k})`;
      explanation = `Case 3: f(n) = Ω(n^${k}) dominates n^${logba.toFixed(2)}`;
    }
    else {
      result = 'Cannot determine (Master Theorem may not apply)';
      explanation = 'The recurrence does not fit any of the Master Theorem cases';
    }

    return {
      result,
      explanation,
      steps: [
        `1. Given recurrence: T(n) = ${a}T(n/${b}) + ${fn}`,
        `2. Calculate logb(a) = log${b}(${a}) = ${logba.toFixed(2)}`,
        `3. Analyze f(n) = ${fn}:`,
        `   - Polynomial degree: ${k}`,
        `   - Contains log term: ${hasLog ? 'Yes' : 'No'}`,
        `4. Compare n^${logba.toFixed(2)} with ${fn}`,
        `5. ${explanation}`,
        `6. Therefore, T(n) = ${result}`
      ]
    };
  };

  return (
    <div className="recurrence-solver">
      <h2>Recurrence Relation Solver</h2>
      
      <div className="solver-input">
        <label>Enter Recurrence Relation:</label>
        <input
          type="text"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
          placeholder="Example: T(n) = 2T(n/2) + n"
        />
        <button onClick={solveRecurrence}>Solve</button>
      </div>

      {solution && !solution.error && (
        <div className="solution">
          <h3>Solution</h3>
          <div className="result">
            <strong>Time Complexity:</strong> {solution.result}
          </div>
          <div className="steps">
            <h4>Solution Steps:</h4>
            <ol>
              {solution.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {solution?.error && (
        <div className="error">
          {solution.error}
        </div>
      )}

      <div className="helper">
        <h3>How to Use</h3>
        <p>Enter a recurrence relation in the format: T(n) = aT(n/b) + f(n)</p>
        <p>Examples:</p>
        <ul>
          <li>T(n) = 2T(n/2) + n</li>
          <li>T(n) = 4T(n/2) + n^2</li>
          <li>T(n) = 3T(n/3) + n log n</li>
          <li>T(n) = 8T(n/2) + n^2</li>
          <li>T(n) = 2T(n/2) + n log n</li>
        </ul>
      </div>
    </div>
  );
}; 