
import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

function BinarySearchSimulator() {
  const [arrayText, setArrayText] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
  const [targetText, setTargetText] = useState('23');
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = useCallback(() => {
    const parsedArray = arrayText.split(',').map(n => parseInt(n.trim(), 10));
    const target = parseInt(targetText, 10);

    if (parsedArray.some(isNaN) || isNaN(target)) {
      setError('Invalid input. Please use comma-separated numbers.');
      setSteps([]);
      setResult(null);
      return;
    }
    
    let isSorted = true;
    for (let i = 0; i < parsedArray.length - 1; i++) {
        if (parsedArray[i] > parsedArray[i+1]) {
            isSorted = false;
            break;
        }
    }

    if (!isSorted) {
        setError('Array must be sorted for binary search to work.');
        setSteps([]);
        setResult(null);
        return;
    }

    setError('');
    setSteps([]);
    setResult(null);

    let low = 0;
    let high = parsedArray.length - 1;
    const newSteps = [];
    let stepCount = 0;

    const intervalId = setInterval(() => {
      if (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const guess = parsedArray[mid];
        
        newSteps.push({
          step: ++stepCount,
          low,
          high,
          mid,
          guess,
          array: [...parsedArray]
        });
        setSteps([...newSteps]);

        if (guess === target) {
          setResult({ found: true, index: mid });
          clearInterval(intervalId);
          return;
        }
        if (guess > target) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      } else {
        setResult({ found: false, index: -1 });
        clearInterval(intervalId);
      }
    }, 500); // 500ms delay for each step

  }, [arrayText, targetText]);

  const renderStep = (step) => {
    return (
      <div style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
        <p><strong>Step {step.step}:</strong> low={step.low}, high={step.high}, mid={step.mid}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {step.array.map((val, index) => {
            let style = { padding: '5px 10px', border: '1px solid #ccc', borderRadius: '3px' };
            if (index >= step.low && index <= step.high) style.backgroundColor = '#f0f8ff';
            if (index === step.mid) style.backgroundColor = '#ffff99';
            if (result && result.found && index === step.mid) style.backgroundColor = '#e6ffed';
            return <div key={index} style={style}>{val}</div>;
          })}
        </div>
        <p>Guessing value at mid index {step.mid} is {step.guess}.</p>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto', padding: '20px', border: '1px solid #ddd' }}>
      <h2 style={{ textAlign: 'center' }}>Binary Search Simulator</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Sorted Array (comma-separated): </label>
        <input type="text" value={arrayText} onChange={e => setArrayText(e.target.value)} style={{ width: '100%', padding: '5px', marginTop: '5px' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label>Target Value: </label>
        <input type="text" value={targetText} onChange={e => setTargetText(e.target.value)} style={{ padding: '5px', marginTop: '5px' }}/>
      </div>
      <button onClick={handleSearch} style={{ padding: '10px 20px', cursor: 'pointer', width: '100%' }}>Search</button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {steps.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Steps:</h3>
          {steps.map(renderStep)}
        </div>
      )}
      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: result.found ? '#e6ffed' : '#ffe6e6', border: result.found ? '1px solid #b2d8b5' : '1px solid #d8b2b2' }}>
          <h3>Result:</h3>
          {result.found ? `Target found at index ${result.index}.` : 'Target not found in the array.'}
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<React.StrictMode><BinarySearchSimulator /></React.StrictMode>);
}
