import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import YupTrial from './YupTrial';
import YupTrialNested from './YupTrialNested';

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <YupTrial /> */}
    <YupTrialNested />
  </React.StrictMode>,
  document.getElementById('root')
);
