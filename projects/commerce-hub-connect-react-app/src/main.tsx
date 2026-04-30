import React from 'react';
import ReactDOM from 'react-dom/client';

import FixtureApp from './fixture-app';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FixtureApp />
  </React.StrictMode>,
);
