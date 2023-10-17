import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';


import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  
    <GoogleOAuthProvider clientId="5618271935-3rup9d3e6hkh7v0p30a9744vs1s8ksjk.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);


