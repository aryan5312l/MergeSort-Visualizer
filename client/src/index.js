import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css'; // Optional for global styles

// Get the root element
const container = document.getElementById('root');

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);