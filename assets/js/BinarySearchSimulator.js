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
      if (parsedArray[i] > parsedArray[i + 1]) {
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
          setResult({
            found: true,
            index: mid
          });
          clearInterval(intervalId);
          return;
        }
        if (guess > target) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      } else {
        setResult({
          found: false,
          index: -1
        });
        clearInterval(intervalId);
      }
    }, 500); // 500ms delay for each step
  }, [arrayText, targetText]);
  const renderStep = step => {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '10px',
        padding: '10px',
        border: '1px solid #eee',
        borderRadius: '5px'
      }
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Step ", step.step, ":"), " low=", step.low, ", high=", step.high, ", mid=", step.mid), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px'
      }
    }, step.array.map((val, index) => {
      let style = {
        padding: '5px 10px',
        border: '1px solid #ccc',
        borderRadius: '3px'
      };
      if (index >= step.low && index <= step.high) style.backgroundColor = '#f0f8ff';
      if (index === step.mid) style.backgroundColor = '#ffff99';
      if (result && result.found && index === step.mid) style.backgroundColor = '#e6ffed';
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        style: style
      }, val);
    })), /*#__PURE__*/React.createElement("p", null, "Guessing value at mid index ", step.mid, " is ", step.guess, "."));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'sans-serif',
      maxWidth: '700px',
      margin: 'auto',
      padding: '20px',
      border: '1px solid #ddd'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: 'center'
    }
  }, "Binary Search Simulator"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("label", null, "Sorted Array (comma-separated): "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: arrayText,
    onChange: e => setArrayText(e.target.value),
    style: {
      width: '100%',
      padding: '5px',
      marginTop: '5px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '15px'
    }
  }, /*#__PURE__*/React.createElement("label", null, "Target Value: "), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: targetText,
    onChange: e => setTargetText(e.target.value),
    style: {
      padding: '5px',
      marginTop: '5px'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleSearch,
    style: {
      padding: '10px 20px',
      cursor: 'pointer',
      width: '100%'
    }
  }, "Search"), error && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'red',
      marginTop: '10px'
    }
  }, error), steps.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px'
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Steps:"), steps.map(renderStep)), result && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: result.found ? '#e6ffed' : '#ffe6e6',
      border: result.found ? '1px solid #b2d8b5' : '1px solid #d8b2b2'
    }
  }, /*#__PURE__*/React.createElement("h3", null, "Result:"), result.found ? `Target found at index ${result.index}.` : 'Target not found in the array.'));
}
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(/*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(BinarySearchSimulator, null)));
}