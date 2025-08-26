import React from 'react';
import ReactDOM from 'react-dom';
function App() {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "Hello from React!"), /*#__PURE__*/React.createElement("p", null, "If you see this, your JSX setup is working correctly."));
}
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(/*#__PURE__*/React.createElement(App, null));
}