import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import SignupContainer from './containers/SignupContainer.jsx';

createRoot(document.getElementById('signup')).render(
  <StrictMode>
    <SignupContainer />
  </StrictMode>,
)